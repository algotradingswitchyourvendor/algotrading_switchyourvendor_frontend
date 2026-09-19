"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { MessageSquare, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const supportSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(255),
  category: z.string().min(1, "Category is required"),
  related_to: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

type SupportFormValues = z.infer<typeof supportSchema>;

export default function ContactSupportPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      category: "general",
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit support ticket");
      }

      setStatus("success");
      reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-primary tracking-widest">SUPPORT</span>
              <div className="h-px w-12 bg-border"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              How can we <span className="text-primary font-normal">help you?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Fill out the form below and our support team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Column (Left) */}
            <div className="lg:col-span-8">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 sm:p-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Ticket Submitted Successfully</h3>
                  <p className="text-muted-foreground mb-8">
                    We've received your request and our team is reviewing it. We'll be in touch shortly.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center h-11 px-8 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Submit Another Ticket
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {status === "error" && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                      <input 
                        id="name"
                        {...register("name")}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                      <input 
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground">Subject</label>
                    <input 
                      id="subject"
                      {...register("subject")}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Brief description of your issue"
                    />
                    {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-foreground">Category</label>
                      <div className="relative">
                        <select 
                          id="category"
                          {...register("category")}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Subscription</option>
                          <option value="feedback">Feature Request / Feedback</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="related_to" className="block text-sm font-medium text-foreground">Related To (Optional)</label>
                      <input 
                        id="related_to"
                        {...register("related_to")}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="e.g. Workspace, Billing ID"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
                    <textarea 
                      id="message"
                      {...register("message")}
                      rows={6}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                      placeholder="Please provide as much detail as possible..."
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 py-2 text-sm font-bold tracking-wide rounded-lg bg-primary text-primary-foreground hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Submitting..." : "Submit Ticket"}
                  </button>
                </form>
              )}
            </div>

            {/* Support Info Column (Right) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
                <div className="w-12 h-12 bg-[#FFEFDE] rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                  <MessageSquare className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">
                  Support Hours
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Our team is available during Indian market hours.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-semibold text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weekend</span>
                    <span className="font-semibold text-foreground">Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111111] rounded-2xl border border-border p-8 shadow-sm text-white">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <Mail className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold mb-4 tracking-tight">
                  Direct Email
                </h3>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Prefer to use your own email client? You can reach us directly at:
                </p>

                <a href="mailto:support@marketpulse.com" className="text-primary hover:text-orange-400 font-medium transition-colors">
                  support@marketpulse.com
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
