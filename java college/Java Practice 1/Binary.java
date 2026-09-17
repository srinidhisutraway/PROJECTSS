import java.util.Scanner;
public class Binary {
    public static void main(String[] args) {
        int start;
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        for(int i=1;i<n+1;i++){
            
                if(i%2 == 0){
                    start=0;
                }else{
                    start=1;
                }
            // System.out.print(start);
            for(int j=0;j<i;j++){
                start=1-start;
                System.out.print(start);
                   

        } System.out.println();
}
    
    }}
