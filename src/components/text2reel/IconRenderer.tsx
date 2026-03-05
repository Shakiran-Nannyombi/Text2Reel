'use client'

import * as Icons from '@mui/icons-material'
import React from 'react'

interface IconRendererProps {
    iconName: string
    [key: string]: any
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, ...props }) => {
    // MUI icons are usually exported as PascalCase, e.g., RocketLaunch
    const IconComponent = (Icons as any)[iconName]

    if (!IconComponent) {
        // Fallback to a generic icon if the name isn't found
        return <Icons.HelpOutline {...props} />
    }

    return <IconComponent {...props} />
}

export default IconRenderer
