import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IMenu } from "../../pages/friend";

interface IMenuProps {
    setListValue: (id: number) => void,
    listValue: number,
    listElements: IMenu[],
};

const MenuSelector = (props: IMenuProps) => {
    
    const [title, setTitle] = useState<string>("Friends");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (e: any) => {
        e.preventDefault();
        setAnchorEl(anchorEl ? null : e.currentTarget)
    }

    const handleMenuItemClick = (e: any, id: number) => {
        e.preventDefault();
        props.setListValue(id);
        // handleMenuClick(e);
    }

    return (
        <>
            <Button
                id="menu-selector-relations"
                variant="contained"
                endIcon={<IoIosArrowDown/>}
                sx={{
                    fontSize: "16px",
                    color: "black",
                    backgroundColor: 'rgb(158, 109, 170)',
                    '&:hover': {
                        backgroundColor: 'rgb(158, 109, 170)',
                    },
                    ml: 12,
                    mt: 5,
                }}
                onClick={(e: any) => handleMenuClick(e)}

            >
                {props.listElements[props.listValue].title}
            </Button>
            <Menu
                open={Boolean(anchorEl)}
                onClose={(e: any) => handleMenuClick(e)}
                anchorEl={anchorEl}
            >
                {props.listElements.map((item: IMenu, id: number) => {
                    return (
                        <div key={id}>
                            <MenuItem
                                sx={{
                                    gap: "10px",
                                }}
                                onClick={(e: any) => handleMenuItemClick(e, item.id)}
                            >
                                {item.icon}
                                {item.title}
                            </MenuItem>
                            { item.separator &&
                                <>
                                    <Divider sx={{ margin: "5px 0" }}/>
                                </>
                            }
                        </div>
                    )
                })}
            </Menu>
        </>
    )
}

export default MenuSelector;