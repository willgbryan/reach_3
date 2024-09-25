import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function TermsAndPrivacy() {
  return (
    <div className="flex justify-center mt-12">
    <Tabs defaultValue="terms" className="w-[800px]">
      <TabsList className="grid w-full grid-cols-2 dark:bg-zinc-800 bg-white">
        <TabsTrigger value="terms">Terms of Use</TabsTrigger>
        <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
      </TabsList>
      <TabsContent value="terms">
        <Card className="dark:bg-zinc-800 bg-white">
          {/* <CardHeader>
            <CardTitle>Terms of Use</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-2">
          <div className="max-w-4xl mx-auto p-4 mt-16">
            <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-normal">
                Terms of Use
            </h1>
            <h2 className="text-neutral-500 text-md md:text-6xl text-center font-normal my-4">
                Version 1.1
            </h2>
            <p className="text-neutral-500 text-center font-normal my-2">
                Last revised on: September 25th, 2024
            </p>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <p>
                The website located at heighliner.tech (the “Site”) is a copyrighted work belonging to Reach AI, Inc. (“Company”, “us”, “our”, and “we”). Certain features of the Site may be subject to additional guidelines, terms, or rules, which will be posted on the Site in connection with such features. All such additional terms, guidelines, and rules are incorporated by reference into these Terms.
                </p>
                <p>
                These Terms of Use (these “Terms”) set forth the legally binding terms and conditions that govern your use of the Site. By accessing or using the Site, you are accepting these Terms (on behalf of yourself or the entity that you represent), and you represent and warrant that you have the right, authority, and capacity to enter into these Terms (on behalf of yourself or the entity that you represent). You may not access or use the Site or accept the Terms if you are not at least 18 years old. If you do not agree with all of the provisions of these Terms, do not access and/or use the Site.
                </p>
                <p>
                PLEASE BE AWARE THAT SECTION 8.2 CONTAINS PROVISIONS GOVERNING HOW TO RESOLVE DISPUTES BETWEEN YOU AND COMPANY. AMONG OTHER THINGS, SECTION 8.2 INCLUDES AN AGREEMENT TO ARBITRATE WHICH REQUIRES, WITH LIMITED EXCEPTIONS, THAT ALL DISPUTES BETWEEN YOU AND US SHALL BE RESOLVED BY BINDING AND FINAL ARBITRATION. SECTION 8.2 ALSO CONTAINS A CLASS ACTION AND JURY TRIAL WAIVER. PLEASE READ SECTION 8.2 CAREFULLY.
                </p>
                <p>
                UNLESS YOU OPT OUT OF THE AGREEMENT TO ARBITRATE WITHIN 30 DAYS: (1) YOU WILL ONLY BE PERMITTED TO PURSUE DISPUTES OR CLAIMS AND SEEK RELIEF AGAINST US ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION OR PROCEEDING AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION; AND (2) YOU ARE WAIVING YOUR RIGHT TO PURSUE DISPUTES OR CLAIMS AND SEEK RELIEF IN A COURT OF LAW AND TO HAVE A JURY TRIAL.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Accounts</h3>
                <h4 className="font-bold mt-4">Account Creation</h4>
                <p>
                In order to use certain features of the Site, you must register for an account (“Account”) and provide certain information about yourself as prompted by the account registration form. You represent and warrant that: (a) all required registration information you submit is truthful and accurate; (b) you will maintain the accuracy of such information. You may delete your Account at any time, for any reason, by following the instructions on the Site. Company may suspend or terminate your Account in accordance with Section 7.
                </p>
                <h4 className="font-bold mt-4">Account Responsibilities</h4>
                <p>
                You are responsible for maintaining the confidentiality of your Account login information and are fully responsible for all activities that occur under your Account. You agree to immediately notify Company of any unauthorized use, or suspected unauthorized use of your Account or any other breach of security. Company cannot and will not be liable for any loss or damage arising from your failure to comply with the above requirements.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Access to the Site</h3>
                <h4 className="font-bold mt-4">License</h4>
                <p>
                Subject to these Terms, Company grants you a non-transferable, non-exclusive, revocable, limited license to use and access the Site solely for your own personal, noncommercial use.
                </p>
                <h4 className="font-bold mt-4">Certain Restrictions</h4>
                <p>
                The rights granted to you in these Terms are subject to the following restrictions: 
                <ul className="list-disc ml-6">
                    <li>You shall not license, sell, rent, lease, transfer, assign, distribute, host, or otherwise commercially exploit the Site, whether in whole or in part, or any content displayed on the Site;</li>
                    <li>You shall not modify, make derivative works of, disassemble, reverse compile or reverse engineer any part of the Site;</li>
                    <li>You shall not access the Site in order to build a similar or competitive website, product, or service;</li>
                    <li>Except as expressly stated herein, no part of the Site may be copied, reproduced, distributed, republished, downloaded, displayed, posted or transmitted in any form or by any means.</li>
                </ul>
                Unless otherwise indicated, any future release, update, or other addition to functionality of the Site shall be subject to these Terms. All copyright and other proprietary notices on the Site (or on any content displayed on the Site) must be retained on all copies thereof.
                </p>
                <h4 className="font-bold mt-4">Modification</h4>
                <p>
                Company reserves the right, at any time, to modify, suspend, or discontinue the Site (in whole or in part) with or without notice to you. You agree that Company will not be liable to you or to any third party for any modification, suspension, or discontinuation of the Site or any part thereof.
                </p>
                <h4 className="font-bold mt-4">No Support or Maintenance</h4>
                <p>
                You acknowledge and agree that Company will have no obligation to provide you with any support or maintenance in connection with the Site.
                </p>
                <h4 className="font-bold mt-4">Ownership</h4>
                <p>
                You acknowledge that all the intellectual property rights, including copyrights, patents, trade marks, and trade secrets, in the Site and its content are owned by Company or Company’s suppliers. Neither these Terms (nor your access to the Site) transfers to you or any third party any rights, title or interest in or to such intellectual property rights, except for the limited access rights expressly set forth in Section 2.1. Company and its suppliers reserve all rights not granted in these Terms. There are no implied licenses granted under these Terms.
                </p>
                <h4 className="font-bold mt-4">Feedback</h4>
                <p>
                If you provide Company with any feedback or suggestions regarding the Site (“Feedback”), you hereby assign to Company all rights in such Feedback and agree that Company shall have the right to use and fully exploit such Feedback and related information in any manner it deems appropriate. Company will treat any Feedback you provide to Company as non-confidential and non-proprietary. You agree that you will not submit to Company any information or ideas that you consider to be confidential or proprietary.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Indemnification</h3>
                <p>
                You agree to indemnify and hold Company (and its officers, employees, and agents) harmless, including costs and attorneys’ fees, from any claim or demand made by any third party due to or arising out of (a) your use of the Site, (b) your violation of these Terms or (c) your violation of applicable laws or regulations. Company reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of these claims. You agree not to settle any matter without the prior written consent of Company. Company will use reasonable efforts to notify you of any such claim, action or proceeding upon becoming aware of it.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Third-Party Links & Ads; Other Users</h3>
                <h4 className="font-bold mt-4">Third-Party Links & Ads</h4>
                <p>
                The Site may contain links to third-party websites and services, and/or display advertisements for third parties (collectively, “Third-Party Links & Ads”). Such Third-Party Links & Ads are not under the control of Company, and Company is not responsible for any Third-Party Links & Ads. Company provides access to these Third-Party Links & Ads only as a convenience to you, and does not review, approve, monitor, endorse, warrant, or make any representations with respect to Third-Party Links & Ads. You use all Third-Party Links & Ads at your own risk, and should apply a suitable level of caution and discretion in doing so. When you click on any of the Third-Party Links & Ads, the applicable third party’s terms and policies apply, including the third party’s privacy and data gathering practices. You should make whatever investigation you feel necessary or appropriate before proceeding with any transaction in connection with such Third-Party Links & Ads.
                </p>
                <h4 className="font-bold mt-4">Other Users</h4>
                <p>
                Your interactions with other Site users are solely between you and such users. You agree that Company will not be responsible for any loss or damage incurred as the result of any such interactions. If there is a dispute between you and any Site user, we are under no obligation to become involved.
                </p>
                <h4 className="font-bold mt-4">Release</h4>
                <p>
                You hereby release and forever discharge Company (and our officers, employees, agents, successors, and assigns) from, and hereby waive and relinquish, each and every past, present and future dispute, claim, controversy, demand, right, obligation, liability, action and cause of action of every kind and nature (including personal injuries, death, and property damage), that has arisen or arises directly or indirectly out of, or that relates directly or indirectly to, the Site (including any interactions with, or act or omission of, other Site users or any Third-Party Links & Ads). IF YOU ARE A CALIFORNIA RESIDENT, YOU HEREBY WAIVE CALIFORNIA CIVIL CODE SECTION 1542 IN CONNECTION WITH THE FOREGOING, WHICH STATES: “A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR OR RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM OR HER MUST HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR OR RELEASED PARTY.”
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Disclaimers</h3>
                <p>
                THE SITE IS PROVIDED ON AN “AS-IS” AND “AS AVAILABLE” BASIS, AND COMPANY (AND OUR SUPPLIERS) EXPRESSLY DISCLAIM ANY AND ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ALL WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, OR NON-INFRINGEMENT. WE (AND OUR SUPPLIERS) MAKE NO WARRANTY THAT THE SITE WILL MEET YOUR REQUIREMENTS, WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS, OR WILL BE ACCURATE, RELIABLE, FREE OF VIRUSES OR OTHER HARMFUL CODE, COMPLETE, LEGAL, OR SAFE. IF APPLICABLE LAW REQUIRES ANY WARRANTIES WITH RESPECT TO THE SITE, ALL SUCH WARRANTIES ARE LIMITED IN DURATION TO 90 DAYS FROM THE DATE OF FIRST USE.
                </p>
                <p>
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSION MAY NOT APPLY TO YOU. SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON HOW LONG AN IMPLIED WARRANTY LASTS, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Limitation on Liability</h3>
                <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL COMPANY (OR OUR SUPPLIERS) BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY LOST PROFITS, LOST DATA, COSTS OF PROCUREMENT OF SUBSTITUTE PRODUCTS, OR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF, OR INABILITY TO USE, THE SITE, EVEN IF COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. ACCESS TO, AND USE OF, THE SITE IS AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE OR COMPUTER SYSTEM, OR LOSS OF DATA RESULTING THEREFROM.
                </p>
                <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY DAMAGES ARISING FROM OR RELATED TO THESE TERMS (FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION), WILL AT ALL TIMES BE LIMITED TO A MAXIMUM OF FIFTY US DOLLARS. THE EXISTENCE OF MORE THAN ONE CLAIM WILL NOT ENLARGE THIS LIMIT. YOU AGREE THAT OUR SUPPLIERS WILL HAVE NO LIABILITY OF ANY KIND ARISING FROM OR RELATING TO THESE TERMS.
                </p>
                <p>
                SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">Term and Termination</h3>
                <p>
                Subject to this Section, these Terms will remain in full force and effect while you use the Site. We may suspend or terminate your rights to use the Site (including your Account) at any time for any reason at our sole discretion, including for any use of the Site in violation of these Terms. Upon termination of your rights under these Terms, your Account and right to access and use the Site will terminate immediately. Company will not have any liability whatsoever to you for any termination of your rights under these Terms, including for termination of your Account. Even after your rights under these Terms are terminated, the following provisions of these Terms will remain in effect: Sections 2.2 through 2.6 and Sections 3 through 8.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">General</h3>
                <h4 className="font-bold mt-4">Changes</h4>
                <p>
                These Terms are subject to occasional revision, and if we make any substantial changes, we may notify you by sending you an e-mail to the last e-mail address you provided to us (if any), and/or by prominently posting notice of the changes on our Site. You are responsible for providing us with your most current e-mail address. In the event that the last e-mail address that you have provided us is not valid, or for any reason is not capable of delivering to you the notice described above, our dispatch of the e-mail containing such notice will nonetheless constitute effective notice of the changes described in the notice. Continued use of our Site following notice of such changes shall indicate your acknowledgement of such changes and agreement to be bound by the terms and conditions of such changes.
                </p>
                <h4 className="font-bold mt-4">Dispute Resolution</h4>
                <p>
                Please read the following arbitration agreement in this Section (the “Arbitration Agreement”) carefully. It requires you to arbitrate disputes with Company, its parent companies, subsidiaries, affiliates, successors and assigns and all of their respective officers, directors, employees, agents, and representatives (collectively, the “Company Parties”) and limits the manner in which you can seek relief from the Company Parties.
                </p>
                <h4 className="font-bold mt-4">Applicability of Arbitration Agreement</h4>
                <p>
                You agree that any dispute between you and any of the Company Parties relating in any way to the Site, the services offered on the Site (the “Services”) or these Terms will be resolved by binding arbitration, rather than in court, except that (1) you and the Company Parties may assert individualized claims in small claims court if the claims qualify, remain in such court and advance solely on an individual, non-class basis; and (2) you or the Company Parties may seek equitable relief in court for infringement or other misuse of intellectual property rights (such as trademarks, trade dress, domain names, trade secrets, copyrights, and patents). This Arbitration Agreement shall survive the expiration or termination of these Terms and shall apply, without limitation, to all claims that arose or were asserted before you agreed to these Terms (in accordance with the preamble) or any prior version of these Terms. This Arbitration Agreement does not preclude you from bringing issues to the attention of federal, state or local agencies. Such agencies can, if the law allows, seek relief against the Company Parties on your behalf. For purposes of this Arbitration Agreement, “Dispute” will also include disputes that arose or involve facts occurring before the existence of this or any prior versions of the Agreement as well as claims that may arise after the termination of these Terms.
                </p>
                <h4 className="font-bold mt-4">Informal Dispute Resolution</h4>
                <p>
                There might be instances when a Dispute arises between you and Company. If that occurs, Company is committed to working with you to reach a reasonable resolution. You and Company agree that good faith informal efforts to resolve Disputes can result in a prompt, low‐cost and mutually beneficial outcome. You and Company therefore agree that before either party commences arbitration against the other (or initiates an action in small claims court if a party so elects), we will personally meet and confer telephonically or via videoconference, in a good faith effort to resolve informally any Dispute covered by this Arbitration Agreement (“Informal Dispute Resolution Conference”). If you are represented by counsel, your counsel may participate in the conference, but you will also participate in the conference.
                </p>
                <p>
                The party initiating a Dispute must give notice to the other party in writing of its intent to initiate an Informal Dispute Resolution Conference (“Notice”), which shall occur within 45 days after the other party receives such Notice, unless an extension is mutually agreed upon by the parties. Notice to Company that you intend to initiate an Informal Dispute Resolution Conference should be sent by email to: will@heighliner.tech, or by regular mail to 12909 Bloomfield Hills Ln, Austin, Texas 78732. The Notice must include: (1) your name, telephone number, mailing address, e‐mail address associated with your account (if you have one); (2) the name, telephone number, mailing address and e‐mail address of your counsel, if any; and (3) a description of your Dispute.
                </p>
                <p>
                The Informal Dispute Resolution Conference shall be individualized such that a separate conference must be held each time either party initiates a Dispute, even if the same law firm or group of law firms represents multiple users in similar cases, unless all parties agree; multiple individuals initiating a Dispute cannot participate in the same Informal Dispute Resolution Conference unless all parties agree. In the time between a party receiving the Notice and the Informal Dispute Resolution Conference, nothing in this Arbitration Agreement shall prohibit the parties from engaging in informal communications to resolve the initiating party’s Dispute. Engaging in the Informal Dispute Resolution Conference is a condition precedent and requirement that must be fulfilled before commencing arbitration. The statute of limitations and any filing fee deadlines shall be tolled while the parties engage in the Informal Dispute Resolution Conference process required by this section.
                </p>
                <h4 className="font-bold mt-4">Arbitration Rules and Forum</h4>
                <p>
                These Terms evidence a transaction involving interstate commerce; and notwithstanding any other provision herein with respect to the applicable substantive law, the Federal Arbitration Act, 9 U.S.C. § 1 et seq., will govern the interpretation and enforcement of this Arbitration Agreement and any arbitration proceedings. If the Informal Dispute Resolution Process described above does not resolve satisfactorily within 60 days after receipt of your Notice, you and Company agree that either party shall have the right to finally resolve the Dispute through binding arbitration. The Federal Arbitration Act governs the interpretation and enforcement of this Arbitration Agreement. The arbitration will be conducted by JAMS, an established alternative dispute resolution provider. Disputes involving claims and counterclaims with an amount in controversy under $250,000, not inclusive of attorneys’ fees and interest, shall be subject to JAMS’ most current version of the Streamlined Arbitration Rules and procedures available at http://www.jamsadr.com/rules-streamlined-arbitration/; all other claims shall be subject to JAMS’s most current version of the Comprehensive Arbitration Rules and Procedures, available at http://www.jamsadr.com/rules-comprehensive-arbitration/. JAMS’s rules are also available at www.jamsadr.com or by calling JAMS at 800-352-5267. A party who wishes to initiate arbitration must provide the other party with a request for arbitration (the “Request”). The Request must include: 
                <ul className="list-disc ml-6">
                    <li>the name, telephone number, mailing address, e‐mail address of the party seeking arbitration and the account username (if applicable) as well as the email address associated with any applicable account;</li>
                    <li>a statement of the legal claims being asserted and the factual bases of those claims;</li>
                    <li>a description of the remedy sought and an accurate, good‐faith calculation of the amount in controversy in United States Dollars;</li>
                    <li>a statement certifying completion of the Informal Dispute Resolution process as described above; and</li>
                    <li>evidence that the requesting party has paid any necessary filing fees in connection with such arbitration.</li>
                </ul>
                </p>
                <p>
                If the party requesting arbitration is represented by counsel, the Request shall also include counsel’s name, telephone number, mailing address, and email address. Such counsel must also sign the Request. By signing the Request, counsel certifies to the best of counsel’s knowledge, information, and belief, formed after an inquiry reasonable under the circumstances, that: 
                <ul className="list-disc ml-6">
                    <li>the Request is not being presented for any improper purpose, such as to harass, cause unnecessary delay, or needlessly increase the cost of dispute resolution;</li>
                    <li>the claims, defenses and other legal contentions are warranted by existing law or by a nonfrivolous argument for extending, modifying, or reversing existing law or for establishing new law; and</li>
                    <li>the factual and damages contentions have evidentiary support or, if specifically so identified, will likely have evidentiary support after a reasonable opportunity for further investigation or discovery.</li>
                </ul>
                </p>
                <p>
                Unless you and Company otherwise agree, or the Batch Arbitration process discussed in Subsection 8.2(h) is triggered, the arbitration will be conducted in the county where you reside. Subject to the JAMS Rules, the arbitrator may direct a limited and reasonable exchange of information between the parties, consistent with the expedited nature of the arbitration. If the JAMS is not available to arbitrate, the parties will select an alternative arbitral forum. Your responsibility to pay any JAMS fees and costs will be solely as set forth in the applicable JAMS Rules.
                </p>
                <p>
                You and Company agree that all materials and documents exchanged during the arbitration proceedings shall be kept confidential and shall not be shared with anyone except the parties’ attorneys, accountants, or business advisors, and then subject to the condition that they agree to keep all materials and documents exchanged during the arbitration proceedings confidential.
                </p>
                <h4 className="font-bold mt-4">Authority of Arbitrator</h4>
                <p>
                The arbitrator shall have exclusive authority to resolve all disputes subject to arbitration hereunder including, without limitation, any dispute related to the interpretation, applicability, enforceability or formation of this Arbitration Agreement or any portion of the Arbitration Agreement, except for the following: 
                <ul className="list-disc ml-6">
                    <li>all Disputes arising out of or relating to the subsection entitled “Waiver of Class or Other Non-Individualized Relief,” including any claim that all or part of the subsection entitled “Waiver of Class or Other Non-Individualized Relief” is unenforceable, illegal, void or voidable, or that such subsection entitled “Waiver of Class or Other Non-Individualized Relief” has been breached, shall be decided by a court of competent jurisdiction and not by an arbitrator;</li>
                    <li>except as expressly contemplated in the subsection entitled “Batch Arbitration,” all Disputes about the payment of arbitration fees shall be decided only by a court of competent jurisdiction and not by an arbitrator;</li>
                    <li>all Disputes about whether either party has satisfied any condition precedent to arbitration shall be decided only by a court of competent jurisdiction and not by an arbitrator; and</li>
                    <li>all Disputes about which version of the Arbitration Agreement applies shall be decided only by a court of competent jurisdiction and not by an arbitrator.</li>
                </ul>
                The arbitration proceeding will not be consolidated with any other matters or joined with any other cases or parties, except as expressly provided in the subsection entitled “Batch Arbitration.” The arbitrator shall have the authority to grant motions dispositive of all or part of any claim or dispute. The arbitrator shall have the authority to award monetary damages and to grant any non-monetary remedy or relief available to an individual party under applicable law, the arbitral forum’s rules, and these Terms (including the Arbitration Agreement). The arbitrator shall issue a written award and statement of decision describing the essential findings and conclusions on which any award (or decision not to render an award) is based, including the calculation of any damages awarded. The arbitrator shall follow the applicable law. The award of the arbitrator is final and binding upon you and us. Judgment on the arbitration award may be entered in any court having jurisdiction.
                </p>
                <h4 className="font-bold mt-4">Waiver of Jury Trial</h4>
                <p>
                EXCEPT AS SPECIFIED IN SECTION 8.2(A) YOU AND THE COMPANY PARTIES HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. You and the Company Parties are instead electing that all covered claims and disputes shall be resolved exclusively by arbitration under this Arbitration Agreement, except as specified in Section 8.2(a) above. An arbitrator can award on an individual basis the same damages and relief as a court and must follow these Terms as a court would. However, there is no judge or jury in arbitration, and court review of an arbitration award is subject to very limited review.
                </p>
                <h4 className="font-bold mt-4">Waiver of Class or Other Non-Individualized Relief</h4>
                <p>
                YOU AND COMPANY AGREE THAT, EXCEPT AS SPECIFIED IN SUBSECTION 8.2(H) EACH OF US MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS, AND THE PARTIES HEREBY WAIVE ALL RIGHTS TO HAVE ANY DISPUTE BE BROUGHT, HEARD, ADMINISTERED, RESOLVED, OR ARBITRATED ON A CLASS, COLLECTIVE, REPRESENTATIVE, OR MASS ACTION BASIS. ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND DISPUTES OF MORE THAN ONE CUSTOMER OR USER CANNOT BE ARBITRATED OR CONSOLIDATED WITH THOSE OF ANY OTHER CUSTOMER OR USER. Subject to this Arbitration Agreement, the arbitrator may award declaratory or injunctive relief only in favor of the individual party seeking relief and only to the extent necessary to provide relief warranted by the party’s individual claim. Nothing in this paragraph is intended to, nor shall it, affect the terms and conditions under the Subsection 8.2(h) entitled “Batch Arbitration.” Notwithstanding anything to the contrary in this Arbitration Agreement, if a court decides by means of a final decision, not subject to any further appeal or recourse, that the limitations of this subsection, “Waiver of Class or Other Non-Individualized Relief,” are invalid or unenforceable as to a particular claim or request for relief (such as a request for public injunctive relief), you and Company agree that that particular claim or request for relief (and only that particular claim or request for relief) shall be severed from the arbitration and may be litigated in the state or federal courts located in the State of Texas. All other Disputes shall be arbitrated or litigated in small claims court. This subsection does not prevent you or Company from participating in a class-wide settlement of claims.
                </p>
                <h4 className="font-bold mt-4">Attorneys’ Fees and Costs</h4>
                <p>
                The parties shall bear their own attorneys’ fees and costs in arbitration unless the arbitrator finds that either the substance of the Dispute or the relief sought in the Request was frivolous or was brought for an improper purpose (as measured by the standards set forth in Federal Rule of Civil Procedure 11(b)). If you or Company need to invoke the authority of a court of competent jurisdiction to compel arbitration, then the party that obtains an order compelling arbitration in such action shall have the right to collect from the other party its reasonable costs, necessary disbursements, and reasonable attorneys’ fees incurred in securing an order compelling arbitration. The prevailing party in any court action relating to whether either party has satisfied any condition precedent to arbitration, including the Informal Dispute Resolution Process, is entitled to recover their reasonable costs, necessary disbursements, and reasonable attorneys’ fees and costs.
                </p>
                <h4 className="font-bold mt-4">Batch Arbitration</h4>
                <p>
                To increase the efficiency of administration and resolution of arbitrations, you and Company agree that in the event that there are 100 or more individual Requests of a substantially similar nature filed against Company by or with the assistance of the same law firm, group of law firms, or organizations, within a 30 day period (or as soon as possible thereafter), the JAMS shall (1) administer the arbitration demands in batches of 100 Requests per batch (plus, to the extent there are less than 100 Requests left over after the batching described above, a final batch consisting of the remaining Requests); (2) appoint one arbitrator for each batch; and (3) provide for the resolution of each batch as a single consolidated arbitration with one set of filing and administrative fees due per side per batch, one procedural calendar, one hearing (if any) in a place to be determined by the arbitrator, and one final award (“Batch Arbitration”).
                </p>
                <p>
                All parties agree that Requests are of a “substantially similar nature” if they arise out of or relate to the same event or factual scenario and raise the same or similar legal issues and seek the same or similar relief. To the extent the parties disagree on the application of the Batch Arbitration process, the disagreeing party shall advise the JAMS, and the JAMS shall appoint a sole standing arbitrator to determine the applicability of the Batch Arbitration process (“Administrative Arbitrator”). In an effort to expedite resolution of any such dispute by the Administrative Arbitrator, the parties agree the Administrative Arbitrator may set forth such procedures as are necessary to resolve any disputes promptly. The Administrative Arbitrator’s fees shall be paid by Company.
                </p>
                <p>
                You and Company agree to cooperate in good faith with the JAMS to implement the Batch Arbitration process including the payment of single filing and administrative fees for batches of Requests, as well as any steps to minimize the time and costs of arbitration, which may include: 
                <ul className="list-disc ml-6">
                    <li>the appointment of a discovery special master to assist the arbitrator in the resolution of discovery disputes; and</li>
                    <li>the adoption of an expedited calendar of the arbitration proceedings.</li>
                </ul>
                This Batch Arbitration provision shall in no way be interpreted as authorizing a class, collective and/or mass arbitration or action of any kind, or arbitration involving joint or consolidated claims under any circumstances, except as expressly set forth in this provision.
                </p>
                <h4 className="font-bold mt-4">30-Day Right to Opt Out</h4>
                <p>
                You have the right to opt out of the provisions of this Arbitration Agreement by sending a timely written notice of your decision to opt out to the following address: 12909 Bloomfield Hills Ln, Austin, Texas 78732, or email to will@heighliner.tech, within 30 days after first becoming subject to this Arbitration Agreement. Your notice must include your name and address and a clear statement that you want to opt out of this Arbitration Agreement. If you opt out of this Arbitration Agreement, all other parts of these Terms will continue to apply to you. Opting out of this Arbitration Agreement has no effect on any other arbitration agreements that you may currently have with us, or may enter into in the future with us.
                </p>
                <h4 className="font-bold mt-4">Invalidity, Expiration</h4>
                <p>
                Except as provided in the subsection entitled “Waiver of Class or Other Non-Individualized Relief”, if any part or parts of this Arbitration Agreement are found under the law to be invalid or unenforceable, then such specific part or parts shall be of no force and effect and shall be severed and the remainder of the Arbitration Agreement shall continue in full force and effect. You further agree that any Dispute that you have with Company as detailed in this Arbitration Agreement must be initiated via arbitration within the applicable statute of limitation for that claim or controversy, or it will be forever time barred. Likewise, you agree that all applicable statutes of limitation will apply to such arbitration in the same manner as those statutes of limitation would apply in the applicable court of competent jurisdiction.
                </p>
                <h4 className="font-bold mt-4">Modification</h4>
                <p>
                Notwithstanding any provision in these Terms to the contrary, we agree that if Company makes any future material change to this Arbitration Agreement, you may reject that change within 30 days of such change becoming effective by writing Company at the following address: 12909 Bloomfield Hills Ln, Austin, Texas 78732, or email to will@heighliner.tech. Unless you reject the change within 30 days of such change becoming effective by writing to Company in accordance with the foregoing, your continued use of the Site and/or Services, including the acceptance of products and services offered on the Site following the posting of changes to this Arbitration Agreement constitutes your acceptance of any such changes. Changes to this Arbitration Agreement do not provide you with a new opportunity to opt out of the Arbitration Agreement if you have previously agreed to a version of these Terms and did not validly opt out of arbitration. If you reject any change or update to this Arbitration Agreement, and you were bound by an existing agreement to arbitrate Disputes arising out of or relating in any way to your access to or use of the Services or of the Site, any communications you receive, any products sold or distributed through the Site, the Services, or these Terms, the provisions of this Arbitration Agreement as of the date you first accepted these Terms (or accepted any subsequent changes to these Terms) remain in full force and effect. Company will continue to honor any valid opt outs of the Arbitration Agreement that you made to a prior version of these Terms.
                </p>
                <h4 className="font-bold mt-4">Export</h4>
                <p>
                The Site may be subject to U.S. export control laws and may be subject to export or import regulations in other countries. You agree not to export, reexport, or transfer, directly or indirectly, any U.S. technical data acquired from Company, or any products utilizing such data, in violation of the United States export laws or regulations.
                </p>
                <h4 className="font-bold mt-4">Disclosures</h4>
                <p>
                Company is located at the address in Section 8.8. If you are a California resident, you may report complaints to the Complaint Assistance Unit of the Division of Consumer Product of the California Department of Consumer Affairs by contacting them in writing at 400 R Street, Sacramento, CA 95814, or by telephone at (800) 952-5210.
                </p>
                <h4 className="font-bold mt-4">Electronic Communications</h4>
                <p>
                The communications between you and Company use electronic means, whether you use the Site or send us emails, or whether Company posts notices on the Site or communicates with you via email. For contractual purposes, you (a) consent to receive communications from Company in an electronic form; and (b) agree that all terms and conditions, agreements, notices, disclosures, and other communications that Company provides to you electronically satisfy any legal requirement that such communications would satisfy if it were be in a hardcopy writing. The foregoing does not affect your non-waivable rights.
                </p>
                <h4 className="font-bold mt-4">Entire Terms</h4>
                <p>
                These Terms constitute the entire agreement between you and us regarding the use of the Site. Our failure to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision. The section titles in these Terms are for convenience only and have no legal or contractual effect. The word “including” means “including without limitation”. If any provision of these Terms is, for any reason, held to be invalid or unenforceable, the other provisions of these Terms will be unimpaired and the invalid or unenforceable provision will be deemed modified so that it is valid and enforceable to the maximum extent permitted by law. Your relationship to Company is that of an independent contractor, and neither party is an agent or partner of the other. These Terms, and your rights and obligations herein, may not be assigned, subcontracted, delegated, or otherwise transferred by you without Company’s prior written consent, and any attempted assignment, subcontract, delegation, or transfer in violation of the foregoing will be null and void. Company may freely assign these Terms. The terms and conditions set forth in these Terms shall be binding upon assignees.
                </p>
                <h4 className="font-bold mt-4">Copyright/Trademark Information</h4>
                <p>
                Copyright © 2024 Reach AI, Inc. All rights reserved. All trademarks, logos and service marks (“Marks”) displayed on the Site are our property or the property of other third parties. You are not permitted to use these Marks without our prior written consent or the consent of such third party which may own the Marks.
                </p>
            </section>
            
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h4 className="font-bold mt-4">Contact Information</h4>
                <p>
                Will Bryan<br />
                Telephone: 512-517-2231<br />
                Email: will@heighliner.tech
                </p>
            </section>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="privacy">
        <Card className="dark:bg-zinc-800 bg-white">
          {/* <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-2">
          <div className="max-w-4xl mx-auto p-4 mt-16">
            <h1 className="relative z-10 text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-normal">
                Privacy Policy
            </h1>
            <h2 className="text-neutral-500 text-md md:text-6xl text-center font-normal my-4">
                Version 1.1
            </h2>
            <p className="text-neutral-500 text-center font-normal my-2">
                Last revised on: September 25th, 2024
            </p>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <p>
                Reach AI, Inc. (the “Company”) is committed to maintaining robust privacy protections for its users. Our Privacy Policy (“Privacy Policy”) is designed to help you understand how we collect, use and safeguard the information you provide to us and to assist you in making informed decisions when using our Service.
                </p>
                <p>
                For purposes of this Agreement, “Site” refers to the Company’s website, which can be accessed at heighliner.tech. “Service” refers to the Company’s services accessed via the Site, in which users can create an account and download copies of provided software. The terms “we,” “us,” and “our” refer to the Company. “You” refers to you, as a user of our Site or our Service. By accessing our Site or our Service, you accept our Privacy Policy and Terms of Use (found here: heighliner.tech/terms-of-use), and you consent to our collection, storage, use and disclosure of your Personal Information as described in this Privacy Policy.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">INFORMATION WE COLLECT</h3>
                <p>
                We collect “Non-Personal Information” and “Personal Information.” Non-Personal Information includes information that cannot be used to personally identify you, such as anonymous usage data, general demographic information we may collect, referring/exit pages and URLs, platform types, preferences you submit and preferences that are generated based on the data you submit and number of clicks. Personal Information includes your email, first and last name which you submit to us through the registration process at the Site.
                </p>
                <h4 className="font-bold mt-4">1. Information collected via Technology</h4>
                <p>
                To activate the Service you do need to submit Personal Information other than your email address. To use the Service thereafter, you do not need to submit further Personal Information. However, in an effort to improve the quality of the Service, we track information provided to us by your browser or by our software application when you view or use the Service, such as the website you came from (known as the “referring URL”), the type of browser you use, the device from which you connected to the Service, the time and date of access, and other information that does not personally identify you. We track this information using cookies, or small text files which include an anonymous unique identifier. Cookies are sent to a user’s browser from our servers and are stored on the user’s computer hard drive. Sending a cookie to a user’s browser enables us to collect Non-Personal information about that user and keep a record of the user’s preferences when utilizing our services, both on an individual and aggregate basis. For example, the Company may use cookies to collect the following information:
                <ul className="list-disc ml-6">
                    <li>User preference on showing or not showing a tutorial or popup display. </li>
                </ul>
                </p>
                <h4 className="font-bold mt-4">2. Information you provide us by registering for an account</h4>
                <p>
                In addition to the information provided automatically by your browser when you visit the Site, to become a subscriber to the Service you will need to create a personal profile. You can create a profile by registering with the Service and entering your email address. By registering, you are authorizing us to collect, store and use your email address in accordance with this Privacy Policy.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">CHILDREN’S PRIVACY</h3>
                <p>
                The Site and the Service are not directed to anyone under the age of 13. The Site does not knowingly collect or solicit information from anyone under the age of 13, or allow anyone under the age of 13 to sign up for the Service. In the event that we learn that we have gathered personal information from anyone under the age of 13 without the consent of a parent or guardian, we will delete that information as soon as possible. If you believe we have collected such information, please contact us at will@heighliner.tech.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">HOW WE USE AND SHARE INFORMATION</h3>
                <h4 className="font-bold mt-4">Personal Information</h4>
                <p>
                Except as otherwise stated in this Privacy Policy, we do not sell, trade, rent or otherwise share for marketing purposes your Personal Information with third parties without your consent. We do share Personal Information with vendors who are performing services for the Company, such as the servers for our email communications who are provided access to user’s email address for purposes of sending emails from us. Those vendors use your Personal Information only at our direction and in accordance with our Privacy Policy.
                </p>
                <p>
                In general, the Personal Information you provide to us is used to help us communicate with you. For example, we use Personal Information to contact users in response to questions, solicit feedback from users, provide technical support, and inform users about promotional offers.
                </p>
                <p>
                We may share Personal Information with outside parties if we have a good-faith belief that access, use, preservation or disclosure of the information is reasonably necessary to meet any applicable legal process or enforceable governmental request; to enforce applicable Terms of Service, including investigation of potential violations; address fraud, security or technical concerns; or to protect against harm to the rights, property, or safety of our users or the public as required or permitted by law.
                </p>
                <h4 className="font-bold mt-4">Non-Personal Information</h4>
                <p>
                In general, we use Non-Personal Information to help us improve the Service and customize the user experience. We also aggregate Non-Personal Information in order to track trends and analyze use patterns on the Site. This Privacy Policy does not limit in any way our use or disclosure of Non-Personal Information and we reserve the right to use and disclose such Non-Personal Information to our partners, advertisers and other third parties at our discretion.
                </p>
                <p>
                In the event we undergo a business transaction such as a merger, acquisition by another company, or sale of all or a portion of our assets, your Personal Information may be among the assets transferred. You acknowledge and consent that such transfers may occur and are permitted by this Privacy Policy, and that any acquirer of our assets may continue to process your Personal Information as set forth in this Privacy Policy. If our information practices change at any time in the future, we will post the policy changes to the Site so that you may opt out of the new information practices. We suggest that you check the Site periodically if you are concerned about how your information is used.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">HOW WE PROTECT INFORMATION</h3>
                <p>
                We implement security measures designed to protect your information from unauthorized access. Your account is protected by a unique hash-identifier that is only provided to the Site when a one time password is entered. We urge you to take steps to keep your personal information safe by not disclosing the one time password sent to your email during the login process and by refusing to share your account with other users. We further protect your information from potential security breaches by implementing certain technological security measures including encryption, firewalls and secure socket layer technology. However, these measures do not guarantee that your information will not be accessed, disclosed, altered or destroyed by breach of such firewalls and secure server software. By using our Service, you acknowledge that you understand and agree to assume these risks.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">YOUR RIGHTS REGARDING THE USE OF YOUR PERSONAL INFORMATION</h3>
                <p>
                You have the right at any time to prevent us from contacting you for marketing purposes. When we send a promotional communication to a user, the user can opt out of further promotional communications by following the unsubscribe instructions provided in each promotional e-mail. You can also indicate that you do not wish to receive marketing communications from us in the Sign Up page of the Site. Please note that notwithstanding the promotional preferences you indicate by either unsubscribing or opting out in the Sign Up page of the Site, we may continue to send you administrative emails including, for example, periodic updates to our Privacy Policy.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">LINKS TO OTHER WEBSITES</h3>
                <p>
                As part of the Service, we may provide links to or compatibility with other websites or applications. However, we are not responsible for the privacy practices employed by those websites or the information or content they contain. This Privacy Policy applies solely to information collected by us through the Site and the Service. Therefore, this Privacy Policy does not apply to your use of a third party website accessed by selecting a link on our Site or via our Service. To the extent that you access or use the Service through or on another website or application, then the privacy policy of that other website or application will apply to your access or use of that site or application. We encourage our users to read the privacy statements of other websites before proceeding to use them.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">CHANGES TO OUR PRIVACY POLICY</h3>
                <p>
                The Company reserves the right to change this policy and our Terms of Service at any time. We will notify you of significant changes to our Privacy Policy by sending a notice to the primary email address specified in your account or by placing a prominent notice on our site. Significant changes will go into effect 30 days following such notification. Non-material changes or clarifications will take effect immediately. You should periodically check the Site and this privacy page for updates.
                </p>
            </section>
            <section className="text-neutral-500 max-w-4xl mx-auto my-2 text-sm text-left relative z-10">
                <h3 className="font-bold mt-4">CONTACT US</h3>
                <p>
                If you have any questions regarding this Privacy Policy or the practices of this Site, please contact us by sending an email to will@heighliner.tech.
                </p>
                <p>Last Updated: This Privacy Policy was last updated on September 25th, 2024.</p>
            </section>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}

