import React from 'react';
import { X, ShieldAlert, Scale, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-[#0D111A] border border-[#1E2638] p-5 text-slate-200 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono-telemetry">
                {t.complianceHeader}
              </h2>
              <p className="text-xs text-slate-400">
                {t.complianceSub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {/* Statutory warning */}
          <div className="p-3 rounded-lg bg-[#2A1215] border border-[#FF1744]/40 text-[#FF8080]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-1 text-[#FF5252]">
              <AlertTriangle className="w-4 h-4 text-[#FF1744]" />
              {t.complianceStatuteTitle}
            </div>
            <p>
              {t.complianceStatuteBody}
            </p>
          </div>

          {/* Product Purpose */}
          <div className="p-3 rounded-lg bg-[#121620] border border-[#1E2638]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-1.5 text-[#00F2FE]">
              <Scale className="w-4 h-4 text-[#00F2FE]" />
              {t.complianceCertTitle}
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>{t.complianceCertItem1}</li>
              <li>{t.complianceCertItem2}</li>
              <li>{t.complianceCertItem3}</li>
            </ul>
          </div>

          {/* Mathematical feasibility comparison */}
          <div className="p-3 rounded-lg bg-[#121620] border border-[#1E2638]">
            <div className="flex items-center gap-2 font-bold font-mono-telemetry uppercase text-[11px] mb-2 text-[#00E676]">
              <BookOpen className="w-4 h-4 text-[#00E676]" />
              {t.complianceMathTitle}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#07090E] border border-red-900/40">
                <span className="font-semibold text-red-400 block mb-1">{t.complianceMathMemorylessTitle}</span>
                <p className="text-slate-400">
                  {t.complianceMathMemorylessBody}
                </p>
              </div>
              <div className="p-2 rounded bg-[#07090E] border border-emerald-900/40">
                <span className="font-semibold text-emerald-400 block mb-1">{t.complianceMathDependentTitle}</span>
                <p className="text-slate-400">
                  {t.complianceMathDependentBody}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1E2638] flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00F2FE] hover:bg-[#00d8e4] text-[#07090E] font-bold text-xs uppercase tracking-wider font-mono-telemetry transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.complianceAckBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
