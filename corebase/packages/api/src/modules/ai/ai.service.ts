import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { logger } from '../../utils/logger';
import { tablesService } from '../tables/tables.service';

const TOOLS = [
    {
        name: "create_table",
        description: "Create a new database table in the current project. Use this when the user asks to create a table, store data, or define a schema.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                tableName: { type: SchemaType.STRING, description: "Name of the table (lowercase, snake_case)" },
                columns: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            name: { type: SchemaType.STRING },
                            type: {
                                type: SchemaType.STRING,
                                enum: ["text", "number", "boolean", "timestamp"],
                                description: "Data type of the column"
                            },
                            required: { type: SchemaType.BOOLEAN },
                            unique: { type: SchemaType.BOOLEAN }
                        },
                        required: ["name", "type"]
                    }
                }
            },
            required: ["tableName", "columns"]
        }
    }
];

export class AiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    private getModel() {
        if (this.model) return this.model;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.warn('GEMINI_API_KEY is missing');
            return null;
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                tools: [{ functionDeclarations: TOOLS }]
            });
            return this.model;
        } catch (err) {
            logger.error('Failed to initialize Gemini:', err);
            return null;
        }
    }

    /**
     * Process a chat message with agentic capabilities
     */
    async chat(message: string, context: { userId: string, projectId?: string }): Promise<string> {
        const model = this.getModel();

        if (!model) {
            return "AI Configuration Error: GEMINI_API_KEY is missing. Please add it to your .env file.";
        }

        try {
            const SYSTEM_CONTEXT = `You are CoreBot, the expert assistant for CoreBase.
            You have access to tools to modify the backend directly.
            
            Current Context:
            - User ID: ${context.userId}
            - Project ID: ${context.projectId || 'NONE (User is on dashboard root)'}
             
            If the user asks to create a table and Project ID is 'NONE', ask them to select a project first.
            Otherwise, use the 'create_table' tool.
            
            Be concise and confirm actions.`;

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: SYSTEM_CONTEXT }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to help manage CoreBase projects." }],
                    }
                ],
            });

            const result = await chat.sendMessage(message);
            const response = result.response;
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                // Execute tools
                const call = functionCalls[0];
                if (call.name === 'create_table') {
                    if (!context.projectId) {
                        return "I can create that table, but I need to know which project you're working on. Please open a project first.";
                    }

                    const args = call.args as any;
                    logger.info(`AI Creating table: ${args.tableName} in project ${context.projectId}`);

                    try {
                        const table = await tablesService.createTable({
                            projectId: context.projectId,
                            tableName: args.tableName,
                            displayName: args.tableName,
                            columns: args.columns
                        });

                        // Send result back to AI
                        const functionResponse = {
                            functionResponse: {
                                name: 'create_table',
                                response: { name: 'create_table', content: { success: true, tableId: table.id } }
                            }
                        };

                        const finalResult = await chat.sendMessage([functionResponse]);
                        return finalResult.response.text();

                    } catch (err: any) {
                        logger.error('Tool Execution Error:', err);

                        // Send error back to AI
                        const functionResponse = {
                            functionResponse: {
                                name: 'create_table',
                                response: { name: 'create_table', content: { success: false, error: err.message } }
                            }
                        };
                        const finalResult = await chat.sendMessage([functionResponse]);
                        return finalResult.response.text();
                    }
                }
            }

            return response.text();

        } catch (error: any) {
            logger.error('Gemini API Error:', error);
            return `I encountered an error: ${error.message}`;
        }
    }
}

export const aiService = new AiService();
