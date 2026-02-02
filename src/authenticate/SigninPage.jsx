import { useDispatch } from "react-redux";

import { authActions } from "../_store";
import { Button, Label, TextInput } from "flowbite-react";

import { useForm } from "react-hook-form";

export default function SigninPage() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});

  const onSubmit = async ({ email, password }) => {
    try {
      await dispatch(authActions.signin({ email, password }));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */

    <div className="mx-auto maw-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">LINKUUP MEDICAL</h1>
        <p className="mt-4 text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero
          nulla eaque error neque ipsa culpa autem, at itaque nostrum!
        </p>
      </div>

      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
          <TextInput
            id="email"
            autoComplete="off"
            placeholder="namelinkuup@gmail.com"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && <span>This field is required</span>}
        </div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your password" />
          <TextInput
            id="password"
            autoComplete="off"
            type="password"
            {...register("password", { required: true })}
          />
          {errors.password && <span>This field is required</span>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
