
import React from 'react';
import { X, ClipboardCheck, Search, Star, FileText, Monitor, CheckCircle2, ArrowRight, ArrowDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProcessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

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

  if (!isOpen) return null;

  // 이미지 파일을 동적으로 불러오기 (viter import.meta.glob 사용)
  // 대소문자 확장자 모두 지원하도록 패턴 수정 (.PNG 등)
  const images = import.meta.glob('../src/assets/manual/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true, import: 'default' });

  // 파일명 기준으로 정렬 (숫자 순서 보장 등)
  const sortedImageUrls = Object.keys(images)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(key => images[key] as string);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <ClipboardCheck size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">사업신청 메뉴얼</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
          {/* 기존 도식화 (Steps) 복구 */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-500 mb-4 px-1">진행 절차</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`relative p-5 rounded-2xl border border-slate-100 flex items-start space-x-4 transition-all hover:shadow-md ${step.dark ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${step.dark ? 'bg-white/20' : step.color}`}>
                      {React.cloneElement(step.icon as React.ReactElement<any>, { className: step.dark ? 'text-white' : 'text-blue-600' })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.dark ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>STEP 0{index + 1}</span>
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${step.dark ? 'text-white' : 'text-slate-800'}`}>{step.title}</h3>
                      <p className={`text-[11px] leading-relaxed break-keep ${step.dark ? 'text-blue-50' : 'text-slate-500'}`}>{step.desc}</p>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                        {index % 2 === 0 && <ArrowRight size={16} className="text-slate-300" />}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start space-x-3">
              <Star size={16} className="text-orange-500 fill-orange-500 mt-0.5" />
              <p className="text-[12px] text-orange-700/90 leading-relaxed font-medium">
                각 단계별 필요한 서류는 아래 상세 메뉴얼을 참고해주세요.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 my-6"></div>

          {/* 이미지 메뉴얼 리스트 */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 mb-4 px-1">상세 메뉴얼 (클릭하여 확대)</h3>
            {sortedImageUrls.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {sortedImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-400"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img
                      src={url}
                      alt={`Manual page ${index + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        확대하기
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText size={32} className="mb-2 opacity-50" />
                <p className="text-xs">상세 메뉴얼 이미지가 없습니다.</p>
              </div>
            )}
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

      {/* 이미지 확대 모달 (Lightbox) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-screen flex flex-col items-center">
            <button
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
              <span className="sr-only">닫기</span>
            </button>
            <img
              src={selectedImage}
              alt="Zoomed manual"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white/60 text-sm mt-4 font-medium">화면을 클릭하면 닫힙니다</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessModal;
