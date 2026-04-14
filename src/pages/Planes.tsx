import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlans, useSubscription } from '../hooks/usePlans';
import { useAuth } from '../hooks/useAuth';
import { Crown, Check, CreditCard, Loader2, ArrowLeft, Zap, Shield, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export function Planes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plans, loading: plansLoading, getAllPlans } = usePlans();
  const { subscription, createSubscription } = useSubscription(user?.id || null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getAllPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !paymentMethod || !user?.id) return;

    setProcessing(true);
    try {
      const result = await createSubscription(selectedPlan);
      if (result.error) {
        alert('Error al procesar el pago: ' + result.error.message);
      } else {
        alert('¡Suscripción exitosa!');
        navigate('/perfil');
      }
    } catch (error) {
      alert('Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  const getPlanIcon = (index: number) => {
    switch (index) {
      case 0: return <Zap className="w-6 h-6" />;
      case 1: return <Star className="w-6 h-6" />;
      case 2: return <Crown className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#477d1e] animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#477d1e] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Volver
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tight">
          Elige tu Plan
        </h1>
        <p className="text-gray-500 text-lg">
          Selecciona el plan que mejor se adapte a tus necesidades nutricionales
        </p>
      </div>

      {showPayment ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Método de Pago</h2>

            <div className="space-y-4 mb-8">
              <button
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                  paymentMethod === 'card'
                    ? "border-[#477d1e] bg-[#8aaa1f]"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <CreditCard className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-bold text-[#1a1a1a]">Tarjeta de Crédito/Débito</p>
                  <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                </div>
                {paymentMethod === 'card' && <Check className="w-5 h-5 text-[#477d1e] ml-auto" />}
              </button>

              <button
                onClick={() => setPaymentMethod('paypal')}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                  paymentMethod === 'paypal'
                    ? "border-[#477d1e] bg-[#8aaa1f]"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#1a1a1a]">PayPal</p>
                  <p className="text-sm text-gray-500">Pago seguro con PayPal</p>
                </div>
                {paymentMethod === 'paypal' && <Check className="w-5 h-5 text-[#477d1e] ml-auto" />}
              </button>
            </div>

            {selectedPlan && plans.find(p => p.id === selectedPlan) && (
              <div className="bg-[#f5f5f5] rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Plan seleccionado:</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{plans.find(p => p.id === selectedPlan)?.name}</p>
                    <p className="text-sm text-gray-500">${plans.find(p => p.id === selectedPlan)?.price}/mes</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || processing}
                className={cn(
                  "flex-1 bg-[#477d1e] hover:bg-[#477d1e] text-white px-6 py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2",
                  (!paymentMethod || processing) && "opacity-50 cursor-not-allowed"
                )}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Pagar Ahora
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "bg-white border rounded-3xl p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105",
                plan.is_popular ? "border-[#477d1e] border-2 relative" : "border-gray-100"
              )}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#477d1e] text-white px-4 py-1 rounded-full text-xs font-bold">
                  Más Popular
                </div>
              )}

              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                `bg-[${plan.color}]`
              )} style={{ backgroundColor: plan.color }}>
                {getPlanIcon(index)}
              </div>

              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-[#1a1a1a]">${plan.price}</span>
                <span className="text-gray-500">/mes</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#477d1e] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={cn(
                  "w-full py-3 rounded-full font-bold transition-all",
                  plan.is_popular
                    ? "bg-[#477d1e] hover:bg-[#477d1e] text-white"
                    : "bg-[#8aaa1f] hover:bg-[#8aaa1f] text-[#477d1e]"
                )}
              >
                Seleccionar Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {subscription && subscription.status === 'active' && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-green-800 font-medium">
            Ya tienes una suscripción activa. <button onClick={() => navigate('/perfil')} className="underline">Ver tu perfil</button>
          </p>
        </div>
      )}
    </div>
  );
}
