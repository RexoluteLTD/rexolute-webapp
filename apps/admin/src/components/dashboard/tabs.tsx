

import { Tabs, TabsList, TabsTrigger } from "@rexolute/ui/tabs"

export function UserTabs() {
  return (
    <Tabs defaultValue="student">
      <TabsList className="w-full max-w-md grid grid-cols-3">
        <TabsTrigger value="student">Student User</TabsTrigger>
        <TabsTrigger value="professional">Professional user</TabsTrigger>
        <TabsTrigger value="suspended">Suspended user</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
