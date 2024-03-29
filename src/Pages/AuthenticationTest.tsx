import React from 'react'
import { withAuth } from '../HOC'

const AuthenticationTest = () => {
  return (
    <div>
      This page can be accessed by any logged user.
    </div>
  )
}

export default withAuth(AuthenticationTest); 
