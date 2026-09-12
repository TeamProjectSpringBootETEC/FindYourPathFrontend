import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { getJobById } from "@/service/JobApi";
import { submitApplication } from "@/service/applicationApi";
import StepIndicator from "@/components/ApplySteps/StepIndicator";
import CvUploadStep from "@/components/ApplySteps/CvUploadStep";
import PersonalStep from "@/components/ApplySteps/PersonalStep";
import ExperienceStep from "@/components/ApplySteps/ExperienceStep";
import EducationStep from "@/components/ApplySteps/EducationStep";

const emptyExperience = { companyName: "", position: "", startDate: "", endDate: "" };
const emptyEducation = { universityName: "", degree: "", major: "", startYear: "", graduationYear: "" };

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [step, setStep] = useState(0);
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    jobTitle: "",
    coverLetter: "",
  });
  const [experiences, setExperiences] = useState([emptyExperience]);
  const [educations, setEducations] = useState([emptyEducation]);

  useEffect(() => {
    getJobById(id)
      .then((data) => {
        setJob(data);
        setForm((prev) => (prev.jobTitle ? prev : { ...prev, jobTitle: data.title }));
      })
      .catch(() => navigate("/job"));
  }, [id, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Please sign in to apply</h1>
          <p className="text-sm text-gray-500 mt-2">You need an account before applying to this job.</p>
          <Link
            to="/login"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.jobTitle.trim()) next.jobTitle = "Job title is required";
    return next;
  };

  const handleCvScanned = (data) => {
    setForm((prev) => ({
      ...prev,
      fullName: data.fullName || prev.fullName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      address: data.address || prev.address,
      jobTitle: data.jobTitle || prev.jobTitle,
    }));
    if (data.experiences?.length) {
      setExperiences(data.experiences.map((e) => ({ ...emptyExperience, ...e })));
    }
    if (data.educations?.length) {
      setEducations(data.educations.map((e) => ({ ...emptyEducation, ...e })));
    }
    setStep(1);
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      const next = validateStep1();
      setErrors(next);
      if (Object.keys(next).length === 0) setStep(2);
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    const cleanExperience = experiences.filter((r) => r.companyName.trim() || r.position.trim());
    const cleanEducation = educations.filter((r) => r.universityName.trim());

    const payload = {
      userId: user.id,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      jobTitle: form.jobTitle.trim(),
      coverLetter: form.coverLetter.trim() || null,
      experiences: cleanExperience.map((r) => ({
        companyName: r.companyName.trim(),
        position: r.position.trim(),
        startDate: r.startDate || null,
        endDate: r.endDate || null,
      })),
      educations: cleanEducation.map((r) => ({
        universityName: r.universityName.trim(),
        degree: r.degree.trim(),
        major: r.major.trim(),
        startYear: r.startYear ? Number(r.startYear) : null,
        graduationYear: r.graduationYear ? Number(r.graduationYear) : null,
      })),
    };

    try {
      setSubmitting(true);
      await submitApplication(id, payload);
      navigate("/apply-success", { replace: true });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to submit your application. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const updateExperience = (index, field, value) => {
    setExperiences((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const updateEducation = (index, field, value) => {
    setEducations((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {job && (
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
            <p className="text-sm text-gray-500">{job.companyName} • {job.location}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <StepIndicator currentStep={step} />
          </div>

          <div className="p-6 md:p-8">
            {step === 0 && (
              <CvUploadStep onScanned={handleCvScanned} onSkip={() => setStep(1)} />
            )}
            {step === 1 && (
              <PersonalStep
                values={form}
                errors={errors}
                onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
              />
            )}
            {step === 2 && (
              <ExperienceStep
                rows={experiences}
                onChange={updateExperience}
                onAdd={() => setExperiences((rows) => [...rows, emptyExperience])}
                onRemove={(index) => setExperiences((rows) => rows.filter((_, i) => i !== index))}
              />
            )}
            {step === 3 && (
              <EducationStep
                rows={educations}
                onChange={updateEducation}
                onAdd={() => setEducations((rows) => [...rows, emptyEducation])}
                onRemove={(index) => setEducations((rows) => rows.filter((_, i) => i !== index))}
              />
            )}
          </div>

          <div className="border-t border-gray-100 px-6 py-5 flex items-center justify-between">
            <button
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {errors.submit && (
              <p className="text-xs text-red-600 max-w-xs text-right">{errors.submit}</p>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}