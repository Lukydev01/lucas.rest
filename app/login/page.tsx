import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Authentication
        </p>
        <h1
          className="mb-4 text-4xl text-white"
        >
          Sign In
        </h1>
        <p className="text-sm leading-relaxed text-neutral-500">
          Sign in to access administrative features.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}