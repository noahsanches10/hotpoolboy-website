import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';

export default async function ContactPage() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const contactContent = getPageContent('contact');
  const servicesConfig = getPageContent('services');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];

  return (
    <div className="min-h-screen">
      <Header 
        siteConfig={siteConfig} 
        navigation={navigation} 
        servicesConfig={servicesConfig}
        enabledServices={enabledServices}
      />
      <main className="pt-2">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {contactContent.showContactInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  {siteConfig.contact.phone && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Phone</p>
                        <a 
                          href={`tel:${siteConfig.contact.phone}`}
                          className="text-primary hover:underline"
                        >
                          {siteConfig.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {siteConfig.contact.email && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <a 
                          href={`mailto:${siteConfig.contact.email}`}
                          className="text-primary hover:underline"
                        >
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {siteConfig.contact.address && (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Address</p>
                        <p className="text-gray-600">{siteConfig.contact.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Business Hours</p>
                      {contactContent.businessHours && Object.entries(contactContent.businessHours).map(([day, hours]) => (
                        <p key={day} className="text-gray-600 capitalize">
                          {day}: {String(hours)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          ) : (
            /* Full Width Contact Form */
            <div className="max-w-4xl mx-auto">
              <ContactForm />
            </div>
          )}
        </div>
      </main>
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}