import React from 'react'
import { withAdminAuth } from '../HOC';


const AuthenticationTestadmin = () => {
  return (
    <div>
      This page can be accessed if role of logged in user is ADMIN.
    </div>
  )
}

export default withAdminAuth(AuthenticationTestadmin);
