"use client"

import {Select, SelectItem} from "@heroui/react";

export function Categories(){
    return (
        <Select 
            placeholder="All Categories" 
            defaultSelectedKeys={["all"]}
            className="w-full md:w-48"
            classNames={{
                trigger: "bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300",
                value: "text-gray-700 font-medium",
                popoverContent: "bg-white border border-gray-200 rounded-lg shadow-lg",
                listbox: "p-2"
            }}
        >
            <SelectItem key="all" textValue="All Categories" className="rounded-md">
                All Categories
            </SelectItem>
            <SelectItem key="01" textValue="Government Documents" className="rounded-md">
                Government Documents
            </SelectItem>
            <SelectItem key="02" textValue="Education" className="rounded-md">
                Education
            </SelectItem>
            <SelectItem key="03" textValue="Career" className="rounded-md">
                Career
            </SelectItem>
            <SelectItem key="04" textValue="Finance" className="rounded-md">
                Finance
            </SelectItem>
            <SelectItem key="05" textValue="Medical" className="rounded-md">
                Medical
            </SelectItem>
            <SelectItem key="06" textValue="Personal" className="rounded-md">
                Personal
            </SelectItem>
        </Select>
    )
}