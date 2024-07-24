import { IProduct } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Image, message, Popconfirm, Space, Switch, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3000/products");
            return res;
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (product: IProduct) => {
            const res = await axios.delete(
                `http://localhost:3000/products/${product.id}`
            );
            return res;
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Xoá sản phẩm thành công!",
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
        onError: () => {
            messageApi.open({
                type: "error",
                content: "Xoá sản phẩm thất bại!",
            });
        },
    });

    const dataSource = data?.data.map((product: IProduct) => {
        return {
            ...product,
            key: product.id,
        };
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Image",
            render: (record: IProduct) => (
                <Image src={record.image} alt="image" width={100} />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Featured",
            render: (record: IProduct) => <Switch checked={record.featured} />,
        },
        {
            title: "Action",
            render: (product: IProduct) => {
                return (
                    <Space>
                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc chắn muốn xóa không?"
                            onConfirm={() => mutate(product)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Xoá
                            </Button>
                        </Popconfirm>
                        <Link to={`/admin/products/${product.id}/edit`}>
                            <Button type="primary">Cập nhật</Button>
                        </Link>
                    </Space>
                );
            },
        },
    ];

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

    return (
        <>
            {contextHolder}
            <Table dataSource={dataSource} columns={columns} />;
        </>
    );
};

export default ProductList;
