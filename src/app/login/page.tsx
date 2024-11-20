"use client";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/localStorage";
import AuthService from "@/services/AuthService";
import cn from "@/utils/cn";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import { setCookie } from "cookies-next/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

interface FormValues {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { access, refresh } = await AuthService.login(data);

      setCookie(ACCESS_TOKEN, access);
      setCookie(REFRESH_TOKEN, refresh);
      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (e) {
      console.log(e);
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-y-10 items-center justify-center">
      <div className="flex items-center gap-x-6">
        <Image
          alt="Ptit Logo"
          src={"/img/ptit.png"}
          width={70}
          height={70}
          className="object-contain"
        />

        <h1 className="text-[32px] font-semibold text-[#151D48]">
          Thư viện PTIT
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5 w-screen max-w-[400px]"
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              placeholder="Tên đăng nhập"
              className={cn({
                "border-error": errors.username,
              })}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              size="large"
              placeholder="Mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className={cn({
                "border-error": errors.password,
              })}
            />
          )}
        />

        <Button type="primary" htmlType="submit" size="large">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
};

export default Login;
