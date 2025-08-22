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
            <div className={`${contactContent.embedForm?.enabled && contactContent.embedForm?.url ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-start' : 'max-w-4xl mx-auto'}`}>
              {/* Contact Information */}
              <div className={`space-y-8 ${contactContent.embedForm?.enabled && contactContent.embedForm?.url ? 'lg:order-2' : ''}`}>
               

                {/* Contact Details */}
                <div className="space-y-8">
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

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Business Hours</p>
                      <div className="mt-2 space-y-1">
                        {contactContent.businessHours && Object.entries(contactContent.businessHours).map(([day, hours]) => (
                          <p key={day} className="text-gray-600 capitalize text-sm">
                            <span className="font-medium">{day}:</span> {String(hours)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional spacing to match form height */}
                {contactContent.embedForm?.enabled && contactContent.embedForm?.url && (
                  <div className="hidden lg:block py-8">
                    <div className="bg-primary-light rounded-lg p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
                      <p className="text-gray-600">Fill out the form and we'll get back to you shortly!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              {contactContent.embedForm?.enabled && contactContent.embedForm?.url && (
                <div className="lg:order-1">
                  <ContactForm />
                </div>
              )}
            </div>
          ) : (
            /* Full Width Contact Form - only show if embedded form is configured */
            contactContent.embedForm?.enabled && contactContent.embedForm?.url && (
              <div className="max-w-4xl mx-auto">
                <ContactForm />
              </div>
            )
          )}
          
          {/* Show message if no form is configured */}
          {(!contactContent.embedForm?.enabled || !contactContent.embedForm?.url) && !contactContent.showContactInfo && (
            <div className="max-w-4xl mx-auto text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Configuration Needed</h2>
              <p className="text-gray-600">Please configure either the contact information section or an embedded form in the admin panel.</p>
            </div>
          )}
        </div>
      </main>
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}