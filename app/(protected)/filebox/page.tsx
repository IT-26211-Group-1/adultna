import ProtectedPageWrapper from "@/components/ui/ProtectedPageWrapper";
import { FileBox } from "./_components/FileBox";

export default function FileBoxPage() {
    return (
        <div>
            <ProtectedPageWrapper>
                <div className="flex h-screen flex-col">
                    {/* Header */}
                    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Adulting Filebox
                        </h1>
                    </header>

                    {/* FileBox Container */}
                    <main className="flex-1 overflow-hidden">
                        <FileBox />
                    </main>
                </div>
            </ProtectedPageWrapper>
        </div>
    );
}