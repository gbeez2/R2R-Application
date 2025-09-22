import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.session_id) {
      setSessionId(router.query.session_id as string);
    }
  }, [router.query.session_id]);

  return (
    <div className="min-h-screen bg-pure-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-insulation-black mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your subscription! You now have access to all premium features.
        </p>

        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Session ID: {sessionId}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-pure-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push('/pricing')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
