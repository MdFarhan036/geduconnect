import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

export default function ServiceDetails() {
    const { slug } = useParams();
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await api.get(`/public/services/${slug}`);
                setService(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchService();
    }, [slug]);

    if (!service) return null;

    const getImageUrl = (path) =>
        path
            ? `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
            : "";

    const heroImages =
        service.banners?.filter((b) => Number(b.is_active) === 1) || [];


    return (
        <>
            {/* ================= HERO ================= */}
            {/* ================= HERO ================= */}
            <div className="about-new">
                {heroImages.length > 0 ? (
                    <div
                        style={{
                            backgroundImage: `url(${getImageUrl(heroImages[0].image_url)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="hero-banner"
                    >
                        <div className="about-new-head overlay">
                            <h1>{service.title}</h1>
                        </div>
                    </div>
                ) : (
                    <div className="about-new-head">
                        <h1>{service.title}</h1>
                    </div>
                )}
            </div>


            {/* ================= ABOUT SECTION ================= */}
            <section className="row-section">
                <div className="container">
                    <div className="about-us">
                        <div className="about-content mr-70">
                            <h2>{service.title}</h2>

                            {/* If description contains HTML */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: service.description || "",
                                }}
                            />
                        </div>

                        <div className="about-img">
                            {service.image_url && (
                                <img src={getImageUrl(service.image_url)}
                                    alt={service.title}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES SECTION ================= */}
            {service.features?.length > 0 && (
                <section className="row-section">
                    <div className="container">
                        <div className="sevices">
                            <div className="service-head">
                                <h2>Why Choose Our {service.title}?</h2>
                            </div>

                            <div className="card-parent">
                                {service.features.map((feature) => (
                                    <div key={feature.id} className="cards">
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= DYNAMIC CONTENT SECTIONS ================= */}
            {service.sections?.map((section, index) => {
                if (section.section_type === "content") {
                    return (
                        <section
                            key={section.id}
                            className={`row-section ${index % 2 === 1 ? "bg-light" : ""
                                }`}
                        >
                            <div className="container">
                                <div className="about-us">
                                    {index % 2 === 1 ? (
                                        <>
                                            <div className="about-img od-2">
                                                {section.image_url && (
                                                    <img
                                                        src={getImageUrl(section.image_url)}
                                                        alt={section.title}
                                                    />
                                                )}
                                            </div>

                                            <div className="about-content ml-70 od-1">
                                                <h2>{section.title}</h2>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: section.content || "",
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="about-content mr-70">
                                                <h2>{section.title}</h2>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: section.content || "",
                                                    }}
                                                />
                                            </div>

                                            <div className="about-img">
                                                {section.image_url && (
                                                    <img
                                                        src={getImageUrl(section.image_url)}
                                                        alt={section.title}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                }

                return null;
            })}
        </>
    );
}
