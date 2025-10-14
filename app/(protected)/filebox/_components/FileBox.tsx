import { SearchSection } from "./SearchSection";
import { UploadDocument } from "./UploadDocument";
import { SecureDocument } from "./SecureDocument";
import { FileDisplay, FileItem } from "./FileItem";

export function FileBox() {
    const fakeFiles: FileItem[] = [
        {
            id: "1",
            name: "Document1.pdf",
            category: "Work",
            size: "2 MB",
            uploadDate: "2023-10-01",
            lastAccessed: "2023-10-10",
            type: "pdf",
            isSecure: false,
        }
    ]

    return (
        <div>
            <SearchSection />
            <FileDisplay files={fakeFiles} viewType="grid" />
        </div>
    );
}
