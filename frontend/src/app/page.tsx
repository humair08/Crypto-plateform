'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Award, Coins, CreditCard, Diamond, Gift, Globe, Headphones, HelpCircle, Info, MessageSquare, Sparkles, Star, Users, Zap, ChevronUp, ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'How do I register?',
    answer: 'Click Register, provide your details, and verify your account to start playing instantly.',
  },
  {
    question: 'Can I withdraw in crypto?',
    answer: 'Yes. Deposit and withdraw using supported crypto networks with fast transaction handling.',
  },
  {
    question: 'Is my account protected?',
    answer: 'Yes. We use strong encryption and security measures to protect your data and funds.',
  },
  {
    question: 'What is the VIP club?',
    answer: 'VIP members receive exclusive bonuses, faster support, and access to premium contests.',
  },
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,255,135,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.12),_transparent_30%)] pointer-events-none" />

        <header className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00FF87]/15 text-[#00FF87] shadow-[0_0_40px_rgba(0,255,135,0.12)]">
                <span className="text-2xl">♠</span>
              </div>
              <div>
                <p className="font-semibold text-lg">Teuzux</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 xl:flex-row xl:items-center xl:justify-center xl:gap-6">
              <div className="inline-flex items-center rounded-full border border-[#2d3344] bg-[#111827] px-4 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(0,255,135,0.08)]">
                <Gift className="mr-2 h-4 w-4 text-cyan-300" />
                Take Your Free Reward
              </div>
              <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
                <Link href="#about" className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-[#2d3344] hover:bg-[#131722]">
                  <Info className="h-4 w-4 text-sky-300" />
                  About Us
                </Link>
                <Link href="#faq" className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-[#2d3344] hover:bg-[#131722]">
                  <HelpCircle className="h-4 w-4 text-violet-300" />
                  FAQ
                </Link>
                <Link href="#vip" className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-[#2d3344] hover:bg-[#131722]">
                  <Award className="h-4 w-4 text-emerald-300" />
                  VIP-Club
                </Link>
              </nav>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link href="/auth/login" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-[#00FF87]/40 hover:bg-[#ffffff0d]">
                Log In
              </Link>
              <Link href="/auth/register" className="rounded-full bg-[#00FF87] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(0,255,135,0.22)] transition hover:opacity-90">
                Register
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#131722] px-6 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] md:px-10 md:py-12">
            <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#0d1724] px-4 py-2 text-sm text-slate-300 shadow-[0_0_40px_rgba(0,255,135,0.08)]">
                  <Sparkles className="h-4 w-4 text-[#00FF87]" />
                  Exclusive crypto casino rewards await.
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Welcome to <span className="text-[#00FF87]">Teuzux</span>!
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                    Register at the world&apos;s #1 crypto casino and unlock exclusive bonuses, fast payouts, and premium VIP rewards in a slick dark luxury experience.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00FF87] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110">
                    <ArrowRight className="h-4 w-4" />
                    Register
                  </Link>
                  <span className="text-sm text-slate-400">Join now and start earning crypto rewards instantly.</span>
                </div>
              </div>

              <div className="relative rounded-[1.75rem] bg-[#0c111a] p-5 shadow-[inset_0_0_20px_rgba(0,255,135,0.07)]">
                <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#00FF87]/20 to-transparent blur-3xl" />
                <div className="absolute right-6 top-6 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 backdrop-blur-xl">
                  Official partner
                </div>
                <div className="relative overflow-hidden rounded-[1.5rem] bg-[#141c2c] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_rgba(15,23,42,0.95))] opacity-80" />
                  <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[1.5rem]">
                    <div className="absolute left-6 top-10 h-40 w-40 rounded-full bg-[#00FF87]/10 blur-3xl" />
                    <div className="absolute right-8 bottom-8 h-36 w-36 rounded-full bg-[#22d3ee]/10 blur-3xl" />
                    <div className="relative z-10 flex h-full w-full items-end justify-center">
                      <div className="h-[220px] w-full rounded-[1.5rem] border border-white/10 bg-[#0b1220] p-4 shadow-[0_25px_40px_rgba(0,0,0,0.35)]">
                        <div className="flex h-full flex-col justify-between rounded-[1.25rem] bg-[#0f1721] p-4">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                            <span>Live partner</span>
                            <span className="rounded-full bg-[#00FF87]/10 px-3 py-1 text-[#00FF87]">Elite</span>
                          </div>
                          <div className="space-y-2 pt-2 text-sm text-white/90">
                            <p>Teuzux sports alliance</p>
                            <p className="text-xs text-slate-400">Driven by premium partners</p>
                          </div>
                          <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 rounded-[1rem] bg-[#0f1720] p-3 text-xs text-slate-300">
                              <span className="block text-3xl font-semibold text-[#00FF87]">Teuzux</span>
                              <span>Crypto Casino</span>
                            </div>
                            <div className="h-20 w-20 rounded-[1.25rem] bg-[#0d131d]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-[#0b121d]/80 p-5 backdrop-blur-xl shadow-[0_30px_50px_rgba(0,0,0,0.18)]">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: '37890', label: 'Total Players Online', icon: Users },
                  { value: '51M+', label: 'Total Registered Players', icon: Star },
                  { value: '$32.5B+', label: 'Total Paid to Players', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-[#131722]/80 p-5">
                      <div className="flex items-center gap-3 text-slate-300">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00FF87]/10 text-[#00FF87]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#131722] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.26)] transition hover:-translate-y-1">
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,_rgba(0,255,135,0.14),_transparent_40%)]" />
            <div className="relative mt-16 space-y-4">
              <div className="rounded-3xl bg-[#0b111a] p-4 text-xs uppercase tracking-[0.3em] text-slate-400">Original Games</div>
              <div className="space-y-3">
                <p className="text-3xl font-semibold text-white">Arcade style play with head-turning design.</p>
                <p className="text-sm leading-7 text-slate-400">
                  Discover exclusive original titles built specifically for crypto players, wrapped in iconic dark luxury visuals.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00FF87]/10 text-[#00FF87]">🎮</span>
                <span>Instant access to premium game rooms.</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#131722] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.26)] transition hover:-translate-y-1">
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_40%)]" />
            <div className="relative mt-16 space-y-4">
              <div className="rounded-3xl bg-[#0b111a] p-4 text-xs uppercase tracking-[0.3em] text-slate-400">Licensed Slots</div>
              <div className="space-y-3">
                <p className="text-3xl font-semibold text-white">Spin the reels with VIP-grade licensed slots.</p>
                <p className="text-sm leading-7 text-slate-400">
                  Immerse in cinematic slot experiences with rich visuals, huge jackpots, and modern crypto support.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00FF87]/10 text-[#00FF87]">🎰</span>
                <span>High RTP, secure bets, fast liquidity.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#131722] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.24)]">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#0c1625] px-4 py-2 text-sm text-slate-300">
              <Info className="h-4 w-4 text-sky-300" />
              About Teuzux
            </div>
            <div className="mt-6 space-y-6">
              <h2 className="text-4xl font-semibold tracking-tight text-white">Teuzux - Best Online Crypto Casino</h2>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Since 2017, Teuzux has been an innovator in blockchain-powered online casinos. Our platform sets itself apart with a vast selection of original games and licensed slots — all backed by provable fair blockchain technology. This ensures a thrilling, transparent, and truly unique gaming experience.
              </p>
              <div className="inline-flex items-center gap-3 rounded-full bg-[#00FF87]/10 px-4 py-3 text-sm text-[#00FF87] shadow-[0_0_35px_rgba(0,255,135,0.18)]">
                <Gift className="h-4 w-4" />
                Take Your Free Reward
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: 'Get Your Earnings In Seconds',
                description: 'Get your winnings credited to your account instantly.',
                icon: CreditCard,
              },
              {
                title: 'Crypto and Bank Deposits',
                description: 'Easily top up with crypto or other secure methods.',
                icon: Coins,
              },
              {
                title: 'Only the Best Promotions',
                description: 'Where top players unlock the most rewarding offers.',
                icon: Gift,
              },
              {
                title: '24-Hour Expert Assistance',
                description: 'Support you can trust with no breaks and no exceptions.',
                icon: Headphones,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-[#0d131f] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition hover:border-[#00FF87]/30 hover:bg-[#111925]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#00FF87]/10 text-[#00FF87]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="vip" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#151a26] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)] md:px-10 md:py-16">
          <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#00FF87]/10 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF87]/20 bg-[#0a151f] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#00FF87]">
                <Sparkles className="h-4 w-4" />
                VIP Club
              </div>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl">Unlock Exclusive VIP Rewards at Teuzux</h2>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Join the VIP Club for more rewards and exclusive monthly contests. Experience faster payouts, premium bonuses, and elite support tailored for top players.
              </p>
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#00FF87] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(0,255,135,0.22)] transition hover:brightness-110">
                Register
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0c141f] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_35%)]" />
              <div className="relative h-80 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-[#111827] to-[#0b1019]">
                <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(0,255,135,0.12),_transparent_40%)]" />
                <div className="absolute left-0 top-6 h-24 w-24 rounded-full bg-[#00FF87]/10 blur-3xl" />
                <div className="absolute right-6 bottom-8 h-36 w-72 rounded-[2rem] bg-[#ffffff0f] blur-2xl" />
                <div className="relative flex h-full items-end justify-center p-6">
                  <div className="h-48 w-full rounded-[2rem] bg-gradient-to-r from-slate-900 via-[#182236] to-[#0c111c] p-4 text-sm text-slate-300 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                    <div className="h-full rounded-[1.5rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_rgba(10,18,28,0.97))] p-4">
                      <div className="flex h-full items-end justify-between">
                        <div className="space-y-2 text-white">
                          <p className="text-2xl font-semibold">Teuzux X-Prototype</p>
                          <p className="text-sm text-slate-400">Limited edition VIP supercar</p>
                        </div>
                        <div className="h-28 w-40 rounded-[1.5rem] bg-[#0f1720]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-[#131722] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-[#0d1724] px-4 py-2 text-sm text-slate-300">
                <MessageSquare className="h-4 w-4 text-cyan-300" />
                FAQ
              </div>
              <h2 className="mt-4 text-4xl font-semibold text-white">Frequently Asked Questions</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                Answers to the most common Teuzux questions, designed to help you get started fast.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {faqItems.map((item, index) => {
              const open = activeFaq === index;
              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setActiveFaq(open ? null : index)}
                  className="w-full rounded-[1.75rem] border border-white/10 bg-[#181f2d] p-5 text-left shadow-[0_25px_75px_rgba(0,0,0,0.18)] transition hover:border-[#00FF87]/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-white">{item.question}</span>
                    {open ? <ChevronUp className="h-5 w-5 text-[#00FF87]" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                  {open && <p className="mt-4 text-sm leading-7 text-slate-300">{item.answer}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#0a0f1a] text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[1.5fr_1.2fr]">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Main', links: ['Games', 'Slots', 'Promotions', 'VIP Club'] },
                { title: 'Team', links: ['About Us', 'Sponsorships', 'Feedback about us', 'Live support'] },
                { title: 'Info', links: ['Privacy Policy', 'Terms of Service', 'Licenses & Security', 'AML Policy'] },
                { title: 'Profile', links: ['Deposit', 'Withdraw', 'Bonuses', 'Settings'] },
              ].map((column) => (
                <div key={column.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">{column.title}</h3>
                  <ul className="space-y-3 text-sm">
                    {column.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="transition hover:text-[#00FF87]">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#131722] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Support</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">24/7</h3>
                </div>
                <div className="h-20 w-20 rounded-3xl bg-[linear-gradient(180deg,_rgba(0,255,135,0.18),_rgba(9,30,56,0.80))] p-3">
                  <div className="h-full w-full rounded-2xl bg-[#0c1526]" />
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-400">
                Contact us if you have questions. Our premium support team is ready to assist every player instantly.
              </p>
              <Link href="#" className="mt-8 inline-flex items-center justify-center rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Write Us
              </Link>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-[#0c1019] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>© 2026 Teuzux</span>
                  <span className="px-2">•</span>
                  <span>Language: EN</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>Support: support@teuzux.com</span>
                  <span>Partners: support@teuzux.com</span>
                  <span>Press: support@teuzux.com</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-3 text-xs text-slate-500 sm:justify-end">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Responsible Gambling</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Hub88</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Betblocker</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">18+</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">GCB</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-6 text-slate-400">
            {[Coins, Diamond, CreditCard, Zap, Globe].map((Icon, index) => (
              <span key={index} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-slate-400 transition hover:bg-[#00FF87]/10 hover:text-[#00FF87]">
                <Icon className="h-6 w-6" />
              </span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
