import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export default function App() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="" />
      </DropdownMenu>
    </Dropdown>
  );
}
