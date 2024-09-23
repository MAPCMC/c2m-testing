import SignIn from "../components/SignIn";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <nav>
          <SignIn />
        </nav>
        <header>
          <h1 className="text-3xl font-bold">
            Connect2Music testportaal
          </h1>
        </header>
      </main>
    </div>
  );
}
