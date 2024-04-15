import React, { useState } from "react";

export const MenuContext = React.createContext<{open: boolean, setOpen: (open: boolean) => void}>({open: true, setOpen: () => {}});

export const MenuContextProvider = ({children}: {children: React.ReactNode}) => {
    const [open, setOpen] = useState<boolean>(true);

    return <MenuContext.Provider value={{open, setOpen: (open: boolean) => setOpen(open)}}>{children}</MenuContext.Provider>
}