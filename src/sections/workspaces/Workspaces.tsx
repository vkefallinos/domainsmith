'use client'

import data from '@/../product/sections/workspaces/data.json'
import { Workspaces } from './components/Workspaces'
import type { WorkspaceUser, RoleDefinition } from '@/../product/sections/workspaces/types'

export default function WorkspacesPreview() {
  return (
    <Workspaces
      users={data.workspaceUsers as WorkspaceUser[]}
      roles={data.roles as RoleDefinition[]}
      selectedUserId={data.workspaceUsers[0].id}
      searchQuery=""
      onSelectUser={(id) => console.log('Selected user:', id)}
      onSearchChange={(query) => console.log('Search:', query)}
      onUpdateRole={(userId, role) => console.log('Update role:', userId, '->', role)}
      onInviteUser={(email, role) => console.log('Invite user:', email, 'as', role)}
      onRemoveUser={(userId) => console.log('Remove user:', userId)}
      onCancel={() => console.log('Cancel edit')}
    />
  )
}
