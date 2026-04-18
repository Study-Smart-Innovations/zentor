
'use client'

import { useState } from "react";
import { addCoursePlan, deleteCoursePlan } from "@/lib/actions/course-plans";
import { Plus, Trash2, Clock, Loader2, Sparkles, CreditCard } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  duration_days: number;
  price: number;
}

interface PlanManagementProps {
  courseId: string;
  initialPlans: Plan[];
}

export function PlanManagement({ courseId, initialPlans }: PlanManagementProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: "Monthly Access",
    durationDays: "30",
    price: ""
  });

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("name", newPlan.name);
    formData.append("durationDays", newPlan.durationDays);
    formData.append("price", newPlan.price);

    const result = await addCoursePlan(formData);
    if (result.success) {
      setPlans([...plans, {
        id: result.planId!,
        name: newPlan.name,
        duration_days: parseInt(newPlan.durationDays),
        price: parseFloat(newPlan.price)
      }]);
      setIsAdding(false);
      setNewPlan({ name: "Monthly Access", durationDays: "30", price: "" });
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to liquidated this payment tier?")) return;
    const result = await deleteCoursePlan(planId, courseId);
    if (result.success) {
      setPlans(plans.filter(p => p.id !== planId));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-serif italic text-editorial-black">Payment Plans</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-editorial-black text-editorial-cream hover:bg-editorial-black/90 transition-all rounded-full"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-editorial-black/50 leading-relaxed font-serif italic mb-6">
         Define the durational access windows for your students. Students will be liquidated from the curriculum once their time expires.
      </p>

      {isAdding && (
         <form onSubmit={handleAddPlan} className="p-6 border border-editorial-black bg-white space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-editorial-black/30 tracking-widest">Plan Name</label>
               <select 
                 value={newPlan.name}
                 onChange={(e) => {
                    const val = e.target.value;
                    let days = "30";
                    if (val.includes("Quarterly")) days = "90";
                    if (val.includes("Half")) days = "180";
                    if (val.includes("Yearly")) days = "365";
                    setNewPlan({...newPlan, name: val, durationDays: days});
                 }}
                 className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-2 text-base font-serif text-editorial-black outline-none"
               >
                  <option value="Monthly Access">Monthly Access (30 Days)</option>
                  <option value="Quarterly Access">Quarterly Access (90 Days)</option>
                  <option value="Half-Yearly Access">Half-Yearly Access (180 Days)</option>
                  <option value="Yearly Access">Yearly Access (365 Days)</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-editorial-black/30 tracking-widest">Price (₹)</label>
               <input 
                 required
                 type="number"
                 placeholder="0.00"
                 value={newPlan.price}
                 onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                 className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-2 text-base font-serif text-editorial-black outline-none"
               />
            </div>

            <button 
               disabled={isLoading}
              className="w-full h-12 bg-editorial-black text-editorial-cream text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2"
            >
               {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Authorize Tier</span>}
            </button>
         </form>
      )}

      <div className="space-y-3">
        {plans.length === 0 ? (
          <div className="p-8 border border-dashed border-editorial-black/10 text-center">
            <CreditCard className="h-8 w-8 text-editorial-black/5 mx-auto mb-3" />
            <p className="text-xs font-serif italic text-editorial-black/30">No durational plans active.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="p-4 bg-editorial-black/[0.02] border border-editorial-black/5 flex justify-between items-center group hover:border-editorial-black/20 transition-all">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase text-editorial-black/20 tracking-widest">{plan.duration_days} Days Access</span>
                 <span className="text-sm font-serif italic text-editorial-black">{plan.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                 <span className="text-sm font-serif font-bold text-editorial-black">₹{plan.price}</span>
                 <button 
                   onClick={() => handleDeletePlan(plan.id)}
                   className="text-red-300 hover:text-red-600 transition-colors p-1"
                 >
                    <Trash2 className="h-4 w-4" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
