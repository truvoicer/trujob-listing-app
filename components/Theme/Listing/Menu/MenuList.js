import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import Link from "next/link";
import { useEffect, useState } from "react";

function MenuList({ name }) {
    const [data, setData] = useState([]);

    async function menuItemsInit(name) {
        const menuFetch = await TruJobApiMiddleware.getInstance().menuRequest(name);
        if (!Array.isArray(menuFetch?.data?.menuItems)) {
            console.warn(`Menu data is not an array | name: ${name}`);
            return;
        }
        setData(menuFetch.data.menuItems);
    }
    useEffect(() => {
        if (!name || name === '') {
            return;
        }
        menuItemsInit(name);
    }, [name]);

    return (
        <ul className="site-menu js-clone-nav mr-auto d-none d-lg-block">

            {data.map((item, index) => {
                return (
                    <li key={index}>
                        <Link
                            href={item?.url || '#'}
                        >
                            {item.title}
                        </Link>
                    </li>
                    /* <li className="active"><a href="index.html">Home</a></li>
                        <li><a href="listings.html">Ads</a></li>
                        <li className="has-children">
                            <a href="about.html">About</a>
                            <ul className="dropdown">
                                <li><a href="#">The Company</a></li>
                                <li><a href="#">The Leadership</a></li>
                                <li><a href="#">Philosophy</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </li>
                        <li><a href="blog.html">Blog</a></li>
                        <li className="mr-5"><a href="contact.html">Contact</a></li>

                        <li className="ml-xl-3 login"><a href="login.html"><span
                            className="border-left pl-xl-4"></span>Log In</a></li>

                        <li>
                            <a href="register.html" className="cta">
                                <span className="bg-primary text-white rounded">Register</span>
                            </a>
                        </li> */
                )
            })}
        </ul>
    );
}
export default MenuList;