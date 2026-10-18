import { useState } from "react";
import { toast } from "react-toastify";

const inputCls =
  "w-full rounded-lg bg-[#0f1a17] border border-gray-700 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500";

const FAQS = [
  {
    q: "Rider is not responding at the pickup point",
    a: "Call the rider from the ride details. If there is no response for a few minutes, cancel the ride from the app.",
  },
  {
    q: "The OTP is not working",
    a: "Ask the rider to check the OTP on their screen. After 5 wrong attempts the ride locks, then raise a ticket with the ride ID.",
  },
  {
    q: "How is my commission calculated?",
    a: "A fixed percentage of each cash ride's fare is deducted from your wallet. Check the Earning page for the breakdown.",
  },
  {
    q: "The Arrived or Complete button is not showing",
    a: "The buttons appear only when you are near the pickup or drop point. Make sure GPS is on and wait a few seconds.",
  },
  {
    q: "I am not getting ride requests",
    a: "Check that you are Online, your documents are approved, and your internet and GPS are working.",
  },
];

export default function Support() {
    const [data,setData]= useState({
      text:""
    })
    const onChangeHandle = (e)=>{
      const {name,value}= e.target;
      setData((prev)=>({
        ...prev,
        [name]:value
      }))
    }
    const submitHandler = (e)=>{
      e.preventDefault();
      toast.success("sent successfully !")
      setData({
        text:""
      })
    }
  return (
    <div className="mx-auto max-w-3xl space-y-8 text-white">
      <h1 className="text-2xl font-bold">Support</h1>

      <section className="rounded-xl border border-red-700 bg-[#1a1114] p-4">
        <p className="font-semibold">Emergency on the road?</p>
        <p className="mt-1 text-sm text-gray-400">
          Call the police first. Do not wait for a ticket.
        </p>
        <a
          href="tel:112"
          className="mt-3 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold"
        >
          Call 112
        </a>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Frequently asked</h2>
        <div className="divide-y divide-gray-700 rounded-xl border border-gray-700">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span>{f.q}</span>
                <span className="text-emerald-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-gray-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Raise a ticket</h2>
        <form onSubmit={submitHandler} className="space-y-3 rounded-xl border border-gray-700 p-4">
          <select className={inputCls}>
            <option>Payment / commission issue</option>
            <option>Rider behaviour</option>
            <option>OTP or ride start problem</option>
            <option>Wrong fare</option>
            <option>App or GPS problem</option>
            <option>Account / documents</option>
            <option>Other</option>
          </select>

          <input
            placeholder="Ride ID (optional, but helps us resolve faster)"
            className={inputCls}
          />

          <textarea
            rows={5}
            maxLength={1000}
            value={data?.text}
            name="text"
            onChange={onChangeHandle}
            placeholder="Describe your problem"
            className={inputCls}
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-emerald-600 py-3 font-semibold"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}