
import React from 'react';
import { X, ClipboardCheck, Search, Star, FileText, Monitor, CheckCircle2, ArrowRight, ArrowDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProcessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <ClipboardCheck className="text-blue-600" size={24} />,
      title: "사업 신청",
      desc: "소상공인마당 홈페이지 온라인 접수",
      color: "bg-blue-50"
    },
    {
      icon: <Search className="text-blue-600" size={24} />,
      title: "서류 검토 및 실사",
      desc: "신청 자격 확인 및 현장 환경 점검",
      color: "bg-blue-50"
    },
    {
      icon: <Star className="text-blue-600" size={24} />,
      title: "대상자 선정",
      desc: "심사위원회 평가를 통한 최종 선정",
      color: "bg-blue-50"
    },
    {
      icon: <FileText className="text-blue-600" size={24} />,
      title: "협약 및 자부담",
      desc: "사업 협약 체결 및 자부담금 입금",
      color: "bg-blue-100"
    },
    {
      icon: <Monitor className="text-blue-600" size={24} />,
      title: "설치 및 검수",
      desc: "배리어프리 키오스크 설치 및 작동 확인",
      color: "bg-blue-100"
    },
    {
      icon: <CheckCircle2 className="text-blue-600" size={24} />,
      title: "지원금 지급",
      desc: "최종 정산 및 지원금 지급 완료",
      color: "bg-blue-600",
      dark: true
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <ClipboardCheck size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">지원사업 추진 절차</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`relative p-5 rounded-2xl border border-slate-100 flex items-start space-x-4 transition-all hover:shadow-md ${step.dark ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${step.dark ? 'bg-white/20' : step.color}`}>
                    {/* Fix: Added explicit 'any' type to React.Element to avoid 'className' prop error during cloning */}
                    {React.cloneElement(step.icon as React.ReactElement<any>, { className: step.dark ? 'text-white' : 'text-blue-600' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.dark ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>STEP 0{index + 1}</span>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${step.dark ? 'text-white' : 'text-slate-800'}`}>{step.title}</h3>
                    <p className={`text-[11px] leading-relaxed break-keep ${step.dark ? 'text-blue-50' : 'text-slate-500'}`}>{step.desc}</p>
                  </div>
                  
                  {/* 데스크탑 화살표 (그리드 배치상 짝수/홀수 고려) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      {index % 2 === 0 && <ArrowRight size={16} className="text-slate-300" />}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-8 p-5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex items-center space-x-2 mb-2">
              <Star size={16} className="text-orange-500 fill-orange-500" />
              <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wider">상담 팁</h4>
            </div>
            <p className="text-[11px] text-orange-700/80 leading-relaxed break-keep font-medium">
              각 단계별로 필요한 서류가 상이할 수 있습니다. <br/>
              현재 매장이 어느 단계인지 말씀해 주시면 맞춤 안내를 도와드릴 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessModal;
