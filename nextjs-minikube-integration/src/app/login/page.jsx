'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { post } from "@/utils/httpRequests";
import { getToken, setToken } from "@/utils/token";
import { Button, Input, Select, SelectItem, Radio, RadioGroup } from "@nextui-org/react";

const LogInPage = () => {

  const router = useRouter();

  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    const token = getToken();
    if (token !== null) {
      router.push("/")
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await post('user', '/auth/login', JSON.stringify(formData));
      setToken(response.data);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError(true);
      console.error('Sign in failed:', error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold mb-4">Sign in to your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 mb-1">
          <Input
            label="Username"
            type="text"
            id="username"
            name="username"
            value={formData.username} onChange={handleChange}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" color="primary" className="w-full" >
            Sign in
          </Button>
        </form>
        <div className={`${error ? "text-red-600" : "hidden"} text-sm text-center`}>
          Invalid username and/or password.
        </div>

        <div className="text-sm text-center pt-5">
          Don&apos;t have an account? Sign up&nbsp;
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            here
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default LogInPage;