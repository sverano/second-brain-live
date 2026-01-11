'use client';

import { usePathname } from 'next/navigation';
import { Brain, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AppFooter() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isSessionPage = pathname === '/session';

  if (isSessionPage) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">Second Brain Live</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t.about.subtitle}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="mailto:contact@secondbrainlive.com"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-300" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.nav.features}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors">
                  {t.features.feature1Title}
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors">
                  {t.features.feature2Title}
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors">
                  {t.features.feature3Title}
                </a>
              </li>
              <li>
                <a href="/demo" className="text-gray-400 hover:text-white transition-colors">
                  {t.nav.demo}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.about.title}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  {t.nav.howItWorks}
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  {t.cta.footerLinks1}
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  {t.cta.footerLinks2}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Second Brain Live. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>{t.cta.footerText1}</span>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>{t.cta.footerText2}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}