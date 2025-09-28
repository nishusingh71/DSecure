const knowledgeBase: { [key: string]: string[] | string } = {
  greeting: ["Hello! How can I help you today?", "Hi there! What can I do for you?", "Welcome to DSecure support. Ask me anything!"],
  pricing: "We have three main plans:\n- **Starter**: £49/month\n- **Professional**: £149/month\n- **Enterprise**: £499/month\n\nYou can see a full feature comparison on our pricing page.",
  services: "We offer a range of data security solutions, including:\n- Secure Data Erasure for HDDs, SSDs, and mobile devices.\n- Security Auditing\n- Compliance Solutions for GDPR, HIPAA, and more.\n\nVisit our services section for more details.",
  erasure: "Our data erasure tools use military-grade algorithms like DoD 5220.22-M and NIST 800-88 to permanently destroy data. You can start by navigating to the 'Data Erasure Tools' page.",
  security: "Security is our top priority. We use end-to-end encryption, certified erasure algorithms, and comply with major international security standards to protect your data.",
  compliance: "Yes, our services are compliant with major regulations like GDPR, HIPAA, and SOX. We provide detailed certificates after each erasure for your audit and compliance needs.",
  support: "For technical support, you can contact our team via the contact form on our website or email us at contact@dsecure.com. Our business hours are Monday to Friday, 9:00 AM to 6:00 PM GMT.",
  account: "You can create an account or sign in by clicking the 'Get Started' or 'Sign In' buttons in the header. An account allows you to track your erasure jobs and manage subscriptions.",
  payment: "We accept all major credit cards through our secure payment gateway, powered by Stripe. Your payment information is fully encrypted and protected.",
  demo: "You can watch a demo of our platform by clicking the 'Watch Demo' button on our homepage. It provides a great overview of our features.",
  "how to": "To get started, head to the 'Data Erasure Tools' page. From there, you can select a device, choose an erasure algorithm, and begin the secure wiping process. You may need to sign in to access this feature.",
  default: "I'm sorry, I'm not sure how to answer that. For more detailed questions, please visit our contact page to get in touch with a human support agent. You can also ask me about 'pricing', 'services', or 'security'."
};

const keywords: { [key: string]: string } = {
  "price": "pricing",
  "cost": "pricing",
  "plan": "pricing",
  "subscribe": "pricing",
  "service": "services",
  "feature": "services",
  "what do you do": "services",
  "erase": "erasure",
  "wipe": "erasure",
  "delete": "erasure",
  "secure": "security",
  "safe": "security",
  "encrypted": "security",
  "gdpr": "compliance",
  "hipaa": "compliance",
  "nist": "compliance",
  "dod": "compliance",
  "help": "support",
  "support": "support",
  "contact": "support",
  "login": "account",
  "register": "account",
  "sign in": "account",
  "sign up": "account",
  "pay": "payment",
  "credit card": "payment",
  "stripe": "payment",
  "video": "demo",
  "demo": "demo",
  "how to": "how to",
  "start": "how to",
  "hello": "greeting",
  "hi": "greeting",
};

export const getChatbotResponse = async (query: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();

  for (const keyword in keywords) {
    if (lowerQuery.includes(keyword)) {
      const responseKey = keywords[keyword];
      const response = knowledgeBase[responseKey];
      if (Array.isArray(response)) {
        return response[Math.floor(Math.random() * response.length)];
      }
      return response;
    }
  }

  return knowledgeBase.default as string;
};
