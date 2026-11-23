import { Bell, Search, Settings } from "lucide-react"
import { Input } from "@rexolute/ui/input"
import { Button } from "@rexolute/ui/button"


export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
      <div className="flex-1">
        <h2 className="text-sm font-semibold">Welcome,</h2>
        <h1 className="text-lg font-semibold">Okey Davids</h1>
      </div>
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search here..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
          </div>
        </form>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src="/placeholder.svg?height=32&width=32"
            width={32}
            height={32}
            alt="Avatar"
            className="rounded-full"
          />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  )
}
