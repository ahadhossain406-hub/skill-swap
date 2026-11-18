import { Link } from 'react-router-dom';
import { UserPlus, Search, Handshake, ArrowLeftRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

const steps = [
  {
    icon: UserPlus,
    title: '1. Create your profile',
    text: 'List the skills you can teach and the skills you want to learn.',
  },
  {
    icon: Search,
    title: '2. Find a mutual match',
    text: 'We find people who teach what you want and want what you teach.',
  },
  {
    icon: Handshake,
    title: '3. Swap and learn',
    text: 'Send a request, schedule sessions, and review each other. No money needed.',
  },
];

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Community-based skill exchange
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Learn One Skill, <span className="text-brand-600">Teach Another.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            SkillSwap connects people who want to learn from each other. Trade your knowledge
            instead of paying for tutoring.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button className="px-6 py-3 text-base">Join for free</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="px-6 py-3 text-base">
                See how it works
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-center text-lg font-semibold text-slate-900">
            A swap in action
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <div className="w-full rounded-xl bg-brand-50 p-4 text-center sm:w-64">
              <p className="font-semibold">Ayesha</p>
              <p className="mt-2 text-xs text-slate-500">Teaches</p>
              <p className="font-medium text-brand-700">Photoshop</p>
              <p className="mt-2 text-xs text-slate-500">Wants to learn</p>
              <p className="font-medium text-brand-700">Web Development</p>
            </div>
            <ArrowLeftRight className="h-8 w-8 rotate-90 text-brand-600 sm:rotate-0" />
            <div className="w-full rounded-xl bg-brand-50 p-4 text-center sm:w-64">
              <p className="font-semibold">Tanvir</p>
              <p className="mt-2 text-xs text-slate-500">Teaches</p>
              <p className="font-medium text-brand-700">Web Development</p>
              <p className="mt-2 text-xs text-slate-500">Wants to learn</p>
              <p className="font-medium text-brand-700">Photoshop</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-brand-600 px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to start swapping skills?</h2>
          <p className="mt-2 text-brand-100">Create your free account in under a minute.</p>
          <Link to="/register" className="mt-6 inline-block">
            <Button variant="outline" className="border-0 px-6 py-3 text-base">
              Create my account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 SkillSwap – University Capstone Project
      </footer>
    </div>
  );
}