package com.loanmanagement.service;

import com.loanmanagement.dto.LoanStatusHistoryDto;
import com.loanmanagement.model.ApplicationStatusHistory;
import com.loanmanagement.repository.ApplicationStatusHistoryRepository;

import com.loanmanagement.dto.LoanRequestDto;
import com.loanmanagement.dto.LoanTypeActiveCountDto;
import com.loanmanagement.model.Loan;
import com.loanmanagement.model.Loan.LoanStatus;
import com.loanmanagement.model.LoanType;
import com.loanmanagement.model.User;
import com.loanmanagement.repository.LoanRepository;
import com.loanmanagement.repository.LoanTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerLoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private LoanTypeRepository loanTypeRepository;
    
    // Inject the repository
    @Autowired
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    public Loan applyLoan(LoanRequestDto dto, User customer) {
        LoanType loanType = loanTypeRepository.findById(dto.getLoanTypeId())
                .orElseThrow(() -> new RuntimeException("Loan Type not found"));

        // Basic null and sanity checks
        if (dto.getLoanAmount() == null) {
            throw new RuntimeException("Loan amount is required");
        }
        if (dto.getLoanDuration() <= 0) {
            throw new RuntimeException("Loan duration must be positive");
        }
        if (dto.getLoanPurpose() == null || dto.getLoanPurpose().trim().isEmpty()) {
            throw new RuntimeException("Loan purpose is required");
        }

        // Business rule: if employmentInfo is Student, income must be "N/A"
        if ("Student".equals(dto.getEmploymentInfo()) && !"N/A".equals(dto.getIncome())) {
            throw new RuntimeException("For Students, monthly income must be 'N/A'");
        }

        // Validate loan amount against max loan amount
        if (dto.getLoanAmount().compareTo(loanType.getMaxLoanAmount()) > 0) {
            throw new RuntimeException("Loan amount exceeds maximum allowed for this loan type");
        }

        // Validate loan tenure against max tenure years
        if (dto.getLoanDuration() > loanType.getMaxTenureYears()) {
            throw new RuntimeException("Loan tenure exceeds maximum allowed for this loan type");
        }

        Loan loan = new Loan();
        loan.setLoanType(loanType);
        loan.setAppliedInterestRate(loanType.getInterestRate().doubleValue());
        loan.setIncome(dto.getIncome());
        loan.setAmount(dto.getLoanAmount());
        loan.setTenureYears(dto.getLoanDuration());
        loan.setPurpose(dto.getLoanPurpose().trim());
        loan.setEmploymentInfo(dto.getEmploymentInfo());
        loan.setAadhaar(dto.getAadhaar());
        loan.setPan(dto.getPan());
        // 🔥 Removed: loan.setPreviousActiveLoans(...)
        loan.setCibilScore(dto.getCibilScore());

        loan.setLoanStatus(LoanStatus.SUBMITTED);
        loan.setCustomer(customer);
        loan.setSubmittedAt(java.time.LocalDateTime.now());

        return loanRepository.save(loan);
    }


    public List<Loan> getLoansByCustomer(User customer) {
        return loanRepository.findByCustomer(customer);
    }

    public Loan getLoanByIdForCustomer(Long loanId, User customer) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        if (!loan.getCustomer().getUserId().equals(customer.getUserId())) {
            throw new RuntimeException("Unauthorized access to loan");
        }
        return loan;
    }
    
    public java.util.Map<Long, Integer> getActiveLoanCounts(User customer) {
        List<Loan> activeLoans = loanRepository.findByCustomerAndLoanStatusIn(
                customer,
                List.of(LoanStatus.SUBMITTED, LoanStatus.APPROVED)
        );

        return activeLoans.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        loan -> loan.getLoanType().getLoanTypeId(),
                        java.util.stream.Collectors.reducing(0, e -> 1, Integer::sum)
                ));
    }
    
    public List<LoanTypeActiveCountDto> getActiveLoanCountsDetailed(User customer) {
        List<Loan> activeLoans = loanRepository.findByCustomerAndLoanStatusIn(
            customer,
            List.of(Loan.LoanStatus.SUBMITTED, Loan.LoanStatus.APPROVED)
        );

        Map<Long, LoanTypeActiveCountDto> map = new HashMap<>();

        for (Loan loan : activeLoans) {
            Long loanTypeId = loan.getLoanType().getLoanTypeId();
            String loanTypeName = loan.getLoanType().getName();

            map.compute(loanTypeId, (id, existing) -> {
                if (existing == null) {
                    return new LoanTypeActiveCountDto(loanTypeId, loanTypeName, 1);
                } else {
                    existing.setCount(existing.getCount() + 1);
                    return existing;
                }
            });
        }

        return new ArrayList<>(map.values());
    }
    
    public List<LoanStatusHistoryDto> getStatusHistoryByLoanId(Long loanId, User customer) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Validate ownership
        if (!loan.getCustomer().getUserId().equals(customer.getUserId())) {
            throw new RuntimeException("Access denied for this loan");
        }

        List<ApplicationStatusHistory> historyList = statusHistoryRepository.findByLoanOrderByUpdatedAtAsc(loan);

        return historyList.stream()
                .map(h -> LoanStatusHistoryDto.builder()
                        .status(h.getStatus().name())
                        .comments(h.getComments())
                        .updatedAt(h.getUpdatedAt())
                        .build())
                .toList();
    }


}
