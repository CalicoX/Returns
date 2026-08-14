import { useState } from "react";
import { FAQS } from "../../content/returnsCopy.js";

/** FAQ accordion — larger panel + height transition */
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="rt-faq" id="returns-faq" itemScope itemType="https://schema.org/FAQPage">
      <div className="rt-wrap">
        <div className="rt-faq-inner">
          <h2 className="rt-faq-title">FAQs</h2>
          <div className="rt-faq-list">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className={`rt-faq-item${isOpen ? " is-open" : ""}`}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    type="button"
                    className="rt-faq-q"
                    aria-expanded={isOpen}
                    onClick={(e) => {
                      setOpen(isOpen ? -1 : i);
                      e.currentTarget.blur();
                    }}
                  >
                    <span itemProp="name">{item.q}</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M5 7.5l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {/* grid 0fr→1fr 实现高度过渡，内容始终在 DOM 中 */}
                  <div
                    className="rt-faq-panel"
                    aria-hidden={!isOpen}
                  >
                    <div
                      className="rt-faq-a"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <div itemProp="text">
                        <p>{item.a}</p>
                        {item.list ? (
                          <ul>
                            {item.list.map((li) => (
                              <li key={li}>{li}</li>
                            ))}
                          </ul>
                        ) : null}
                        {item.a2 ? <p>{item.a2}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
