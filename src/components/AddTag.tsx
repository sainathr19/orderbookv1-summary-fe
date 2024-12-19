import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { axiosInstance } from "@/lib/api";
import { useState } from "react";


type Props = {
    address : string
    addTagToUser? : (address : string , tag : string) => void
};
export function AddTag({address , addTagToUser} : Props) {
    const [tag,setTag] = useState("");
    const handleAddTag = async () => {
        if(!tag || tag==="") return;
        try {
            const { data } = await axiosInstance.get(`/tag?address=${address}&tag=${tag}`);
            console.log("Tag Added",data);
            addTagToUser?.(address,tag);
        } catch(err) {
            console.error("Error adding Tag ",err);
        }
    }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Tag</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new Tag</SheetTitle>
          <SheetDescription>
            {address}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tag name
            </Label>
            <Input id="name" value={tag} className="col-span-3" onChange={(e)=>setTag(e.target.value)} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleAddTag}>Add</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
