import React from 'react';

function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
            
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Information We Collect</h2>
                    <p className="leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, update your profile, or use our interactive features. This includes your name, email address, password, and any academic data (schedules, notes, tasks) you input into the system.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. How We Use Your Information</h2>
                    <p className="leading-relaxed">
                        We use the information we collect to provide, maintain, and improve our services. This includes generating AI study plans, tracking attendance statistics, and synchronizing your data across devices. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Data Security</h2>
                    <p className="leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Third-Party Services</h2>
                    <p className="leading-relaxed">
                        Alloy integrates with third-party service such as Google Gemini (for AI features). Your interactions with these features are governed by the privacy policies of those respective third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at support@alloyapp.com.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;