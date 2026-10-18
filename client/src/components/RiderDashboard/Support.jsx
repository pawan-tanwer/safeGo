
import { useState } from "react";
import { toast } from "react-toastify";

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
        <p className="font-semibold">In an emergency?</p>
        <p className="mt-1 text-sm text-gray-400">
          Call the police directly. Do not wait for a ticket.
        </p>
        <a href="tel:112" className="mt-3 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold">
          Call 112
        </a>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Frequently asked</h2>
        <div className="divide-y divide-gray-700 rounded-xl border border-gray-700">
          <details className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span>My driver is not reaching the pickup point</span>
              <span className="text-emerald-400 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-gray-400">
              Check the driver's live location on the map. If he has not moved for a few minutes, cancel and book again.
            </p>
          </details>

          <details className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span>How does the ride OTP work?</span>
              <span className="text-emerald-400 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-gray-400">
              When the driver arrives, a 6-digit OTP is shown on your screen. Share it only after you are inside the vehicle.
            </p>
          </details>

          <details className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span>Can I cancel a ride?</span>
              <span className="text-emerald-400 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-gray-400">
              Yes, before the ride starts. Once the ride is ongoing, cancellation is not allowed.
            </p>
          </details>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Raise a ticket</h2>
        <form className="space-y-3 rounded-xl border border-gray-700 p-4" onSubmit={submitHandler}
        >
          <select className="w-full rounded-lg bg-[#0f1a17] px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Ride issue</option>
            <option>Payment issue</option>
            <option>Driver behaviour</option>
            <option>App problem</option>
            <option>Other</option>
          </select>
          <textarea
            rows={5}
            value={data?.text}
            name="text"
            onChange={onChangeHandle}
            maxLength={1000}
            placeholder="Describe your problem"
            className="w-full rounded-lg bg-[#0f1a17] px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="w-full rounded-lg cursor-pointer bg-emerald-600 py-3 font-semibold">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}