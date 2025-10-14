import { Categories } from "./Categories";
import { Search } from "./Search";
import { ViewType } from "./ViewType";
import { Button } from "@heroui/button";

export function SearchSection() {
    return (
        <div className="flex flex-col md:flex-row md:items-center py-16 gap-4 mb-6">
            <Categories includeAllCategories={true} />
            <div className="flex items-center gap-4">
                <Search />
                <ViewType />
                <Button className="bg-adult-green text-white hover:bg-adult-green/90 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    + Upload
                </Button>
            </div>
        </div>
    );
}
