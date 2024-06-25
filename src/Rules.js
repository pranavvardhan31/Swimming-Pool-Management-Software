import React from 'react';
import './Rules.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

function Rules() {
  return (
    <div className="rules-container">
        <h1 className='rules-h1' >Rules and Regulations</h1>
        <h2>User Registration</h2>
        <p>Registration to the website is a one-time and compulsory process and it only signifies your interest in our activities. However, under no circumstances does website registration guarantee availability of a swimming slot.</p>

        <h2>Schedule Date and Time</h2>
        <p>Members are not allowed to enter the pool except on their scheduled date and time. Unauthorized entry to the swimming pool is strictly prohibited and will invite appropriate action.</p>

        <h2>Minimum Height Requirement</h2>
        <p>For obtaining swimming membership, the candidate must be taller than 4 ft, preferably an inch or two more. Under no circumstances children below 4 ft height will be allowed in the swimming pool. Please do not obtain membership if the height of the member is below 4 ft. At any point of time if it is found that the height of the member is below 4 ft, the membership will be summarily cancelled. No refund will be made under any circumstances.</p>

        <h2>Card Not Transferable</h2>
        <p>Swimming card is 'Non Transferable'. If a member is found to misuse his/her membership card, his/her membership will be immediately cancelled and will be barred from obtaining future membership.</p>

        <h2>Only Members Are Allowed in the Changing Room</h2>
        <p>Only members are allowed to enter the changing room during their specific slot. Guardians are not allowed in the changing room under any circumstances.</p>

        <h2>Attempt to Use an Invalid Card</h2>
        <p>Card with expired validity cannot be used under any circumstances. If a member is found to be using an expired card for gaining access to the pool, a penalty of Rs. 1000/- will be charged for the first time and membership will be cancelled for repeated offence.</p>

        <h2>Dress Code for the Pool and Deck Area</h2>
        <p>Members shall enter the pool/deck area only with swimming costume as shown in the DRESS CODE page of this website. Learners must use red cap and swimmers may use cap of any color other than red.</p>

        <h2>Members Are Not Allowed to Enter the Pool with Valuable Items</h2>
        <p>Members are not allowed to enter the pool with any item like mobile phone, ear ring, chain, necklace, ring, etc. Those may be easily lost during the slot and will also clog the drain and damaged the pool. TAS will not take any responsibility of any valuables.</p>

        <h2>Appointed Course Coordinators Are the Only Persons Empowered to Train/Teach Swimming</h2>
        <p>Course Coordinators are only empowered to train/teach swimming in the pool. No one else should try to teach swimming to another person.</p>

        <h2>Take Proper Shower Before Entering the Pool</h2>
        <p>After changing to the swimming costumes, keep all your belongings in the changing room and take a thorough shower before entering the pool. Toiletries like oil, soap, color etc. are strictly prohibited before entering the pool. A soap shower is recommended after the slot.</p>

        <h2>Boys up to 10 Years of Age Are Allowed in the Ladies Slot</h2>
        <p>Boys up to 10 years of age are allowed in the ladies slots. Once the boy attains 10 years of age, he should change his slot (immediate next January). Otherwise, if such a member is identified, a fine of Rs.500 will be imposed per month along with the slot change fee.</p>

        <h2>Safety: Always Use Ladder While Entering the Pool</h2>
        <p>Always use ladder while entering the pool. Also follow all instructions given to you in the pool and the deck area. Membership will be cancelled and no refund will be made if a member fails to follow safety instructions given by coach/trainer.</p>

        <h2>Swimming Pool May Remain Fully Closed Due to Events/Competitions</h2>
        <p>Student's sports activity has higher priority. A times, due to such student activities, the swimming pool may remain partly / fully closed or TAS may change the time/duration of slots with prior notification.</p>

        <h2>Force Majeure</h2>
        <p>For any unnatural situation be it natural calamity or major technical fault beyond the control of PMC, the operation of swimming pool may remain suspended for short duration or prolonged period. No refund/adjustment will be made in such cases.</p>

        <h2>No Refund Policy</h2>
        <p>Be careful before depositing any money to the SBI PMC A/C No. of PMC is 12345678901.</p>

        <h2>Document Required for Outsiders</h2>
        <p>At the time of registration, an outsider will have to provide an identity proof issued by state/Central Government.</p>

        <h2>For More Information</h2>
        <p>For any additional information, please contact us through e-mail (HeavyCoder@gmail.com).</p>

        <h2>Membership</h2>
        <p> Members should pay membership fees has to be paid after every month to renew their membership</p>

        <h2>Eligibility for Deep Water Swimming</h2>
        <p>Only PMC approved swimmers are allowed to swim at the deep side of the pool. Non-swimmers and new users who are willing to swim at the deep side of the pool must pass the TAS swimmer test. TAS swimmer test comprises of the following components:</p>
        <ol>
            <li>200m non-stop swimming in 50m length.</li>
            <li>Five (05) minutes treading on the deep side of the swimming pool.</li>
            <li>Object collection from deep water by jumping from one meter diving platform.</li>
        </ol>
        <p>A user must clear all the tests in a single go.</p>

        <p>This concludes the rules and regulations for the swimming pool club. For any further queries or clarifications, please feel free to reach out to us.</p>
        <p className='Credits'> - Mr.Manager, Pool Management Committee </p>
        <div>
          <Link to="/" className='rules-back'><IoIosArrowBack /> Back </Link>
        </div>
        </div>

    );
}

export default Rules