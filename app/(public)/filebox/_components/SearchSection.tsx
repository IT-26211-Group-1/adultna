import { Categories } from "./Categories";
import { Search } from "./Search";
import { ViewType } from "./ViewType";

export function SearchSection() {
    return (
        <div className="flex flex-col md:flex-row md:items-center py-16 gap-4 mb-6">
            <Categories />
            <div className="flex items-center gap-4">
                <Search />
                <ViewType />
            </div>
        </div>
    );
}
