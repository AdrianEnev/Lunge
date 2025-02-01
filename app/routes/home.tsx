import type { Route } from "./+types/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lunge" },
    { name: "description", content: "Lunge: Fitness Tracker" },
  ];
}

export default function Home() {

    return (
        <div className="w-full h-full font-rubik p-5"> 

            <div className="flex flex-col">
                
                <p className="text-3xl text-black mt-5 font-semibold">
                    Welcome back, User!
                </p>

                <p className="text-3xl text-black mt-5 font-base">
                    All account information will be displayed here.
                </p>

            </div>
            
        </div>
    );
}
