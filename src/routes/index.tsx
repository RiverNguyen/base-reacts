import LayoutAdmin from "@/page/(dashboard)/layout";
import ProductAdd from "@/page/(dashboard)/product/_components/Add";
import ProductEdit from "@/page/(dashboard)/product/_components/Edit";
import ProductList from "@/page/(dashboard)/product/page";
import { Route, Routes } from "react-router-dom";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="admin" element={<LayoutAdmin />}>
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/add" element={<ProductAdd />} />
                    <Route path="products/:id/edit" element={<ProductEdit />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;
