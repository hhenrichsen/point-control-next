import CreateGameForm from "./creategameform";

export default function CreateGame(): JSX.Element {
  return (
    <div className="w-104 m-8 rounded-md bg-slate-50 p-8 shadow-lg dark:bg-slate-950">
      <div className="flex justify-center p-2 pt-4">
        <h1 className="text-3xl">Create Game</h1>
      </div>
      <CreateGameForm />
    </div>
  );
}
