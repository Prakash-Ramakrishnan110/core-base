"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Upload, File, MoreVertical, Trash2, Download } from "lucide-react";

export default function StoragePage() {
    const [files, setFiles] = useState([
        { id: "1", name: "avatar.png", size: "2.4 MB", type: "image/png", date: "2026-01-04" },
        { id: "2", name: "document.pdf", size: "1.1 MB", type: "application/pdf", date: "2026-01-05" }
    ]);

    const handleUpload = () => {
        alert("Upload feature would open a file picker here.");
        // Mock upload
        const newFile = {
            id: Date.now().toString(),
            name: `upload_${Date.now()}.jpg`,
            size: "0.5 MB",
            type: "image/jpeg",
            date: new Date().toISOString().split('T')[0]
        };
        setFiles([newFile, ...files]);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this file?")) {
            setFiles(files.filter(f => f.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Storage</h1>
                    <p className="text-slate-400">Store and serve user-generated content.</p>
                </div>
                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Upload className="w-4 h-4" /> Upload File
                </Button>
            </div>

            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                    <Folder className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files uploaded</h3>
                    <p className="text-slate-500 mb-6">Upload files to manage them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="group relative bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-800 rounded-lg">
                                    <File className="w-6 h-6 text-slate-400" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500" onClick={() => handleDelete(file.id)}>
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-slate-200 truncate" title={file.name}>{file.name}</h3>
                                <p className="text-xs text-slate-500">{file.size} • {file.date}</p>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-x-0 bottom-0 p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="w-full h-8 text-xs">
                                        <Download className="w-3 h-3 mr-1" /> Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
