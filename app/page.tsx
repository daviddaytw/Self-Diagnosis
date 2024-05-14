import Image from "next/image";
import { DemoChat } from "./components/DemoChat";

export default function Home() {
  return (
    <main className="min-h-screen p-16">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-4xl pb-6">Self-Diagnosis</h1>

          <section className="py-6" style={{ backgroundColor: '#FFFA' }}>
              <h2 className="text-4xl mt-10 pt-5">The best way to understand your symptoms before seeing a doctor.</h2>
              <p className="font-light text-2xl text-gray-500 py-6 mb-10">
                A young AI chatbot that aims to assist you to get to know the possible disease you got.
                <br /> Get started now!
              </p>
          </section>
        </div>
        <div className="p-16">
          <DemoChat />
        </div>
      </div>
    </main>
  );
}
