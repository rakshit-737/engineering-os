# Cold Email Templates

Five templates for the outreach situations that matter most in an engineering job search. Fill every `{{slot}}` before sending — an unfilled slot is an instant delete.

## The Rules (apply to every email)

1. **Under 120 words.** Busy people read the first two lines and the ask. Cut everything that is about you but not about why *they* should care.
2. **One clear ask.** Never "advice, and also a referral, and also feedback on my resume". Pick one; make it easy to say yes to (10 minutes, one forward, one reply).
3. **Specific hook in the first line.** Name their paper, talk, project, commit, or team — something that proves this email could not have been sent to anyone else. Generic first lines ("I hope this finds you well") signal mass mail.
4. Send Tuesday-Thursday morning in their timezone. Follow up exactly once, after 5-7 days.
5. Links go at the bottom, never mid-paragraph. Resume + one best link, not four.

---

## 1) Research Internship Request — to a Professor

**Subject:** Question about {{paper_or_lab_topic}} — prospective research intern

**Body:**

> Dear Professor {{LastName}},
>
> I read your {{year}} paper on {{specific_paper}}, and the {{specific_result_or_method}} stood out to me — I attempted a small reproduction of {{specific_part}} as a course project ({{one_line_result}}).
>
> I am a {{year}}-year CS ({{specialization}}) student at {{university}}, and I would love to contribute to {{lab_name}}'s work on {{research_direction}} as a research intern this {{semester/summer}}. I have experience with {{relevant_skill_1}} and {{relevant_skill_2}}.
>
> Would you be open to a short call, or could I share a one-page proposal?
>
> CV: {{link}} · Project: {{link}}
>
> Regards,
> {{YourName}}

**Why this works:** Professors delete hundreds of "Dear Sir, I am interested in your esteemed lab" emails. Citing a *specific* result — and better, having reproduced part of it — proves you read the paper, not just the lab homepage. The ask offers two low-cost options (call or proposal), letting a busy professor pick the cheaper one.

---

## 2) Referral Request — to an Engineer

**Subject:** {{Company}} {{Role}} — quick question from a {{university}} CS student

**Body:**

> Hi {{FirstName}},
>
> Your {{blog_post/talk/open-source_project}} on {{specific_topic}} helped me {{concrete_thing_it_helped_with}} — thank you for that.
>
> I am a {{year}}-year CS (Cybersecurity) student applying for {{role}} on {{team}} ({{job_link}}). I have built {{most_relevant_project_one_line_with_metric}}, which maps closely to the job's {{requirement}}.
>
> If my background looks like a reasonable fit to you, would you be willing to refer me? Happy to send anything that makes it easier — resume attached.
>
> Resume: {{link}} · GitHub: {{link}}
>
> Thanks either way,
> {{YourName}}

**Why this works:** The conditional framing ("if my background looks like a reasonable fit") gives them a graceful exit, which paradoxically raises yes-rates — referrals put their name on the line. Mapping one project directly to one job requirement does their evaluation work for them. "Thanks either way" removes pressure.

---

## 3) Recruiter Follow-Up

**Subject:** Re: {{Role}} application — {{YourName}} ({{req_ID_if_any}})

**Body:**

> Hi {{RecruiterName}},
>
> I applied for {{role}} on {{date}} and wanted to briefly flag two things since my application:
>
> 1. {{new_signal — e.g. "shipped v2 of my IDS project, now detecting X with 94% precision"}}
> 2. {{fit_point — e.g. "the posting's Kubernetes requirement matches my internship work at Y"}}
>
> I remain very interested and can interview any time in the next {{timeframe}}. Is there anything else you need from me to move my application forward?
>
> Resume: {{link}}
>
> Best,
> {{YourName}}

**Why this works:** "Just following up" adds no information and is easy to ignore. Adding a *new signal* gives the recruiter a fresh reason to reopen your file, and the numbered format is skimmable in five seconds. Ending with a concrete process question ("anything else you need?") invites a reply rather than a mental "noted".

---

## 4) Conference / Meetup Follow-Up

**Subject:** Great meeting you at {{event}} — the {{topic_you_discussed}} question

**Body:**

> Hi {{FirstName}},
>
> We spoke after {{session/talk}} at {{event}} on {{day}} — I asked about {{specific_question_or_topic}}.
>
> I looked into {{thing_they_mentioned}} afterward and {{what_you_found_or_built — one line}}. You mentioned {{their_team/project}} works on {{area}}; that is exactly the direction I want to grow in.
>
> Would you be open to a 15-minute chat about {{specific_narrow_topic}} in the next couple of weeks?
>
> {{LinkedIn/GitHub}}: {{link}}
>
> Thanks,
> {{YourName}}

**Why this works:** Sent within 48 hours, the subject line reactivates a real memory ("the person who asked about X"). Showing you *acted* on something they said — read the thing, tried the tool — converts you from "attendee #40" to "the one who followed through". The narrow, time-boxed ask is easy to calendar.

---

## 5) Thank-You After Interview

**Subject:** Thank you — {{Role}} interview, {{date}}

**Body:**

> Hi {{InterviewerName}},
>
> Thank you for the conversation today. I especially enjoyed digging into {{specific_technical_topic_from_interview}} — your point about {{thing_they_said}} gave me a new angle on it.
>
> One brief addendum: on the {{question_you_could_have_answered_better}} question, I later realized {{sharper_answer_in_one_sentence}}.
>
> Our discussion made me more confident this role is the right fit, particularly {{aspect_of_role_or_team}}. Looking forward to next steps.
>
> Best,
> {{YourName}}

**Why this works:** Sent the same day, it lands before the interviewer writes their feedback. Referencing a specific exchange proves engagement; the one-line "addendum" turns your weakest moment into evidence of reflection — interviewers consistently rate candidates who self-correct higher. No new ask: the only goal is a positive final impression.

---

## Follow-Up Rule

One follow-up per thread, 5-7 days later, max 3 sentences: restate the ask, add one new piece of information, stop. No reply after that means no — move on and log it in `Internship-Application-Tracker.csv`.
