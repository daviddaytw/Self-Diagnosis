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

      <footer className="p-4 flex gap-2 justify-end">
            <div className="text-gray-500">Built with ❤️ by <a href="https://davidday.tw" className="text-sky-600" target="_blank">David Day</a></div>
            <iframe src="https://ghbtns.com/github-btn.html?user=daviddaytw&repo=Self-Diagnosis&type=star&count=true" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
        </footer>
    </main>
  );
}
