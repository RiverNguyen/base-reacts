import { IProduct } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Switch } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductEdit = () => {
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["products", id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:3000/products/${id}`);
            return res;
        },
    });

    const { mutate, isError, isPending } = useMutation({
        mutationFn: async (product: IProduct) => {
            const res = await axios.put(
                `http://localhost:3000/products/${id}`,
                product
            );
            return res;
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Cập nhật sản phẩm thành công!",
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
        onError: () => {
            messageApi.open({
                type: "error",
                content: "Cập nhật sản phẩm thất bại!",
            });
        },
    });

    if (isError) <div>Error</div>;

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={data?.data}
                onFinish={mutate}
                autoComplete="off"
                disabled={isPending}
            >
                <Form.Item<IProduct>
                    label="Tên sản phẩm"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Tên sản phẩm không được để trống!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IProduct> label="Ảnh sản phẩm" name="image">
                    <Input />
                </Form.Item>

                <Form.Item<IProduct>
                    name="price"
                    label="Giá sản phẩm"
                    rules={[
                        {
                            required: true,
                            message: "Giá sản phẩm không được để trống!",
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item<IProduct> name="description" label="Mô tả">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item<IProduct> name="featured" label="Sản phẩm nổi bật">
                    <Switch />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Cập nhật sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ProductEdit;
